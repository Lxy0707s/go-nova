package executor

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	execSockPath = "./executor.sock"
	listURI      = "/services/list"
	aliveURI     = "/services/alive"
	stopURI      = "/services/stop"
	startURI     = "/services/start"
	listenDomain = "127.0.0.1"
)

var (
	config Config
)

type (
	Config struct {
		OffDaemonServer bool
		CtrlCCatch      bool
	}
)

func Setup(cfg Config) {
	config.OffDaemonServer = cfg.OffDaemonServer
	config.CtrlCCatch = cfg.CtrlCCatch
}

type (
	// Service 完整的服务接口
	Service interface {
		Starter
		Stopper
	}
)

type (
	// Starter 开始方法的接口
	Starter interface {
		Start() error
	}
	// Stopper 结束方法的接口
	Stopper interface {
		Stop()
	}
	// MulServices 多服务程序的注册
	MulServices interface {
		ServicesRegistration() []Service
	}
	// Program 完整程序的接口
	Program interface {
		Starter
		Stopper
	}
	// MulServicesProgram 支持多服务启动及关闭的程序接口
	MulServicesProgram interface {
		Starter
		Stopper
		MulServices
	}
)

// CtrlC 捕获ctrl-c的控制器
type CtrlC struct {
	starts         Starter
	stops          Stopper
	mulServices    MulServices
	mulServicesMap map[string]Service
	servicesLock   sync.RWMutex
	httpServerPort uint16
}

// NewCtrlC 初始化生成CtrlC
func NewCtrlC() *CtrlC {
	return &CtrlC{}
}

// SetStarter 设置开始方法
func (c *CtrlC) SetStarter(s Starter) *CtrlC {
	c.starts = s
	return c
}

// SetStopper 设置结束方法
func (c *CtrlC) SetStopper(s Stopper) *CtrlC {
	c.stops = s
	return c
}

// SetMulServices 设置注册多服务的方法
func (c *CtrlC) SetMulServices(m MulServices) *CtrlC {
	c.mulServices = m
	return c
}

// 服务是否存活
func (c *CtrlC) httpServerIsAlive() bool {
	isAlive := false
	portInt64, err := readPortFile(execSockPath)
	if err != nil {
		log.Panic(err)
	}
	if portInt64 != 0 {
		client := &http.Client{
			Timeout: time.Second,
		}
		url := fmt.Sprintf("http://%s:%s%s", listenDomain, strconv.FormatInt(portInt64, 10), listURI)
		resp, err := client.Get(url)
		if err == nil && resp.StatusCode == http.StatusOK {
			isAlive = true
		}
	}
	return isAlive
}

func (c *CtrlC) startDaemonHTTPServer() {
	//serverIsAlive := c.httpServerIsAlive()
	//// 需要复写当前端口到文件中
	//if serverIsAlive {
	//	log.Println("(startDaemonHTTPServer) warning: executor already alive")
	//	//log.Panic("executor already alive")
	//}
	r := gin.New()
	r.Use(gin.Logger())
	listener, err := net.Listen("tcp", listenDomain+":0")
	if err != nil {
		log.Fatal("(startDaemonHTTPServer) listen", err)
	}

	// 获取tcp端口
	listenStr := listener.Addr().String()
	addrSlice := strings.Split(listenStr, ":")
	log.Println("(startDaemonHTTPServer) addrSlice", addrSlice)
	if len(addrSlice) != 2 {
		log.Fatal("executor listen port error", listenStr)
	}
	//复写端口
	err = ioutil.WriteFile(execSockPath, []byte(addrSlice[1]), os.ModePerm)
	if err != nil {
		log.Fatal("executor write sock error", listenStr)
	}

	gin.SetMode(gin.DebugMode)
	registerPprof(r)
	r.GET(aliveURI, c.serviceAliveHandle())
	r.GET(listURI, c.serviceListHandler())
	r.POST(stopURI, c.closeServicesHandle())
	r.POST(startURI, c.startServicesHandle())

	server := &http.Server{
		Handler:           r,
		ReadHeaderTimeout: 2 * time.Second,
		WriteTimeout:      2 * time.Second,
	}
	err = server.Serve(listener)
	if err != nil {
		log.Panic(err)
	}
}

func (c *CtrlC) serviceAliveHandle() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.JSON(http.StatusOK, nil)
	}
}

func (c *CtrlC) serviceListHandler() gin.HandlerFunc {
	return func(context *gin.Context) {
		c.servicesLock.RLock()
		defer c.servicesLock.RUnlock()

		if c.mulServicesMap == nil {
			context.JSON(http.StatusInternalServerError, nil)
			return
		}
		serviceList := make([]string, 0)
		for serviceName := range c.mulServicesMap {
			//serviceNameArr := strings.Split(serviceName, "*")
			//serviceNameArrLen := len(serviceNameArr)
			//serviceList = append(serviceList, serviceNameArr[serviceNameArrLen-1])
			serviceList = append(serviceList, serviceName)
		}
		context.JSON(http.StatusOK, serviceList)
	}
}

func (c *CtrlC) closeServicesHandle() gin.HandlerFunc {
	return func(context *gin.Context) {

		serviceList := make([]string, 0)
		err := context.BindJSON(&serviceList)
		if err != nil {
			context.JSON(http.StatusBadRequest, nil)
			return
		}

		failServiceList := make([]string, 0)
		c.servicesLock.RLock()
		defer c.servicesLock.RUnlock()
		if c.mulServicesMap == nil {
			context.JSON(http.StatusInternalServerError, nil)
			return
		}
		for _, serviceName := range serviceList {
			if v, ok := c.mulServicesMap[serviceName]; ok {
				mtv := reflect.ValueOf(&v).Elem()
				fmt.Println(mtv.MethodByName("Stop").Call(nil))
			} else {
				failServiceList = append(failServiceList, serviceName)
			}
		}
		if len(failServiceList) != 0 {
			context.JSON(http.StatusBadRequest, failServiceList)
			return
		} else {
			context.JSON(http.StatusOK, nil)
			return
		}
	}
}

func (c *CtrlC) startServicesHandle() gin.HandlerFunc {
	return func(context *gin.Context) {
		serviceList := make([]string, 0)
		err := context.BindJSON(&serviceList)
		if err != nil {
			context.JSON(http.StatusBadRequest, nil)
			return
		}
		failServiceList := make([]string, 0)

		c.servicesLock.RLock()
		defer c.servicesLock.RUnlock()
		if c.mulServicesMap == nil {
			context.JSON(http.StatusInternalServerError, nil)
			return
		}
		for _, serviceName := range serviceList {
			if v, ok := c.mulServicesMap[serviceName]; ok {
				mtv := reflect.ValueOf(&v).Elem()
				mtv.MethodByName("Start").Call(nil)[0].String()
			} else {
				failServiceList = append(failServiceList, serviceName)
			}
		}
		if len(failServiceList) != 0 {
			context.JSON(http.StatusBadRequest, failServiceList)
			return
		} else {
			context.JSON(http.StatusOK, nil)
		}
	}
}

func (c *CtrlC) stopMulServices() {
	if c.mulServicesMap == nil || len(c.mulServicesMap) == 0 {
		return
	}
	c.servicesLock.RLock()
	defer c.servicesLock.RUnlock()
	//if c.mulServicesMap != nil {
	//	for _, item := range c.mulServicesMap {
	//		mtv := reflect.ValueOf(&item).Elem()
	//		mtv.MethodByName("Stop").Call(nil)
	//	}
	//}
	if c.mulServices != nil {
		servicesSlice := c.mulServices.ServicesRegistration()
		for i := len(servicesSlice) - 1; i >= 0; i-- {
			servicesSlice[i].Stop()
		}
	}
}

func (*CtrlC) waitSignals(signals ...os.Signal) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, signals...)
	<-c
}

func (c *CtrlC) waitKill() {
	c.waitSignals(os.Interrupt, syscall.SIGTERM, syscall.SIGHUP)
}

// RunWithSignal 运行程序，并捕获 ctrl+c，如果有问题会 panic
func (c *CtrlC) RunWithSignal() {
	go c.startMulServices()
	c.waitKill()
	c.stopMulServices()
}

func (c *CtrlC) startMulServices() {
	if reflect.ValueOf(c.starts).IsNil() {
		return
	}
	// 启动前置服务
	if err := c.starts.Start(); err != nil {
		log.Panic(err)
	}
	if c.mulServices == nil {
		return
	}
	// 启动内部多服务
	services := c.mulServices.ServicesRegistration()
	if services == nil {
		log.Panic("executor ServicesRegistration must not nil")
	}
	mulServicesMap := make(map[string]Service, len(services))
	for _, service := range services {
		// 启动子服务
		if err := service.Start(); err != nil {
			log.Panic("executor start err", err)
		}

		// 记录子服务
		serviceName := reflect.TypeOf(service).String()
		mulServicesMap[serviceName] = service
	}

	c.servicesLock.Lock()
	c.mulServicesMap = mulServicesMap
	c.servicesLock.Unlock()
}

// Run 开始运行程序，遇到os.Interrupt停止
func (c *CtrlC) Run() {
	signalChan := make(chan os.Signal, 1)
	if config.CtrlCCatch {
		signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)
	}

	// 没有注册多服务的进程不需要开启http server
	go func() {
		if reflect.ValueOf(c.starts).IsNil() {
			return
		}
		// 启动前置服务
		if err := c.starts.Start(); err != nil {
			log.Panic(err)
		}

		// 启动程序内部的服务列表
		if c.mulServices != nil {
			mulServicesMap := make(map[string]Service)
			servicesSlice := c.mulServices.ServicesRegistration()
			if servicesSlice == nil {
				log.Panic("executor ServicesRegistration must not nil")
			}
			// 处理命令行的数据
			// c.handleFlag(port)

			// 启动http管理服务
			if !config.OffDaemonServer {
				go c.startDaemonHTTPServer()
			}

			var serviceName string
			for _, service := range servicesSlice {
				serviceName = reflect.TypeOf(service).String()
				mulServicesMap[serviceName] = service
				err := service.Start()
				if err != nil {
					log.Panic("executor start err", err)
				}
			}
			c.servicesLock.Lock()
			c.mulServicesMap = mulServicesMap
			c.servicesLock.Unlock()
		}
	}()

	<-signalChan

	c.stopMulServices()

	if reflect.ValueOf(c.stops).IsNil() {
		return
	}
	c.stops.Stop()
}

var globalExecutor = NewCtrlC()

// SetStarter 设置全局开始方法
func SetStarter(s Starter) {
	globalExecutor.SetStarter(s)
}

// SetStopper 设置全局结束方法
func SetStopper(s Stopper) {
	globalExecutor.SetStopper(s)
}

// Run 开始运行程序
func Run() {
	globalExecutor.Run()
}

// Exec 立即开始运行程序ex
func Exec(ex Program) {
	globalExecutor.SetStarter(ex)
	globalExecutor.SetStopper(ex)
	globalExecutor.Run()
}

// ExecMulSerProgram 执行多服务程序
func ExecMulSerProgram(ex MulServicesProgram) {
	globalExecutor.SetMulServices(ex)
	globalExecutor.SetStarter(ex)
	globalExecutor.SetStopper(ex)
	globalExecutor.Run()
}

// ExecMulWithSignal 执行多服务程序，捕获 ctrl+c
func ExecMulWithSignal(ex MulServicesProgram) {
	globalExecutor.SetMulServices(ex)
	globalExecutor.SetStarter(ex)
	globalExecutor.SetStopper(ex)
	globalExecutor.RunWithSignal()
}
