package http_client

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"time"
)

const (
	// Post is a http request type
	Post = "post"
	// Get is a http request type
	Get = "get"
)

type (
	// SingleOption is the option of target
	SingleOption struct {
		Name        string
		Address     string
		AppID       int
		UserId      string
		Secret      string
		Token       string
		Body        []byte
		Timeout     int64
		Interval    int64
		Type        string
		Update      func(data []byte, apiName string)
		SpecialDeal func(opt *SingleOption) *SingleOption
	}

	// target is a single target to sync data
	target struct {
		opt       *SingleOption
		transport *http.Transport
	}

	// Manager is a manager to sync all api
	Manager struct {
		targets  []*target
		stopSign chan int
	}
)

// NewManager return Manager with option
func NewManager(options []*SingleOption) *Manager {
	transport := &http.Transport{
		MaxIdleConns: len(options) * 10,
	}

	targets := make([]*target, 0, len(options))
	for _, opt := range options {
		targets = append(targets, &target{
			opt:       opt,
			transport: transport,
		})
	}

	return &Manager{
		targets:  targets,
		stopSign: make(chan int, 1),
	}
}

// Start is to start the service
func (m *Manager) Start() error {
	go m.loop()
	return nil
}

// Stop is to stop the service
func (m *Manager) Stop() {
	m.stopSign <- 1
}

// Refresh sync immediately by name
func (m *Manager) Refresh(name string) bool {
	for _, target := range m.targets {
		if target.opt.Name == name {
			return target.refresh()
		}
	}
	return false
}

func (m *Manager) loop() {
	for _, target := range m.targets {
		go target.refresh()
	}

	<-time.After(time.Duration(1e9-time.Now().UnixNano()%1e9) * time.Nanosecond)
	ticker := time.NewTicker(time.Second)
	for {
		select {
		case <-ticker.C:
			go m.refresh(time.Now().Unix())
		case <-m.stopSign:
			return
		}
	}
}

func (m *Manager) refresh(t int64) {
	for _, target := range m.targets {
		if t%target.opt.Interval == 0 {
			target.refresh()
		}
	}
}

func (t *target) refresh() bool {
	st := time.Now()
	address := t.opt.Address
	body := t.opt.Body
	if t.opt.SpecialDeal != nil && t.opt.Name != "all_endpoints" {
		optBak := t.opt.SpecialDeal(t.opt)
		address = optBak.Address
		body = optBak.Body
	}
	client := &http.Client{
		Timeout: time.Second * time.Duration(t.opt.Timeout),
	}
	req, err := http.NewRequest(t.opt.Type, address, bytes.NewBuffer(body))
	if err != nil {
		return false
	}
	if t.opt.Token != "" {
		req.Header.Add("Authorization", t.opt.Token)
	}
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Println("synchronizer : get api error", "api name", t.opt.Name, "error", err, "address", address)
		return false
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Println("synchronizer : get api error (status)", "api name", t.opt.Name, "status", resp.StatusCode, "address", address)
		return false
	}
	var result []byte
	if t.opt.Update != nil {
		if result, err = io.ReadAll(resp.Body); err != nil {
			log.Println("synchronizer : read body fail", "err", err)
			return false
		}
		t.opt.Update(result, t.opt.Name)
	}
	log.Println("synchronizer : get api data", "api name", t.opt.Name, "address", address, "duration", time.Since(st), "body", string(body), "len", len(result))
	return true
}
