package curtain

import (
	"fmt"
	"runtime"
	"strconv"

	"github.com/fatih/color"
)

var AppSays string

func CurtainGenerator(appName, author, appVersion, buildTime, appStrUp string) {
	if appStrUp == "" {
		appStrUp = `
________________________________________________________________________________
         
             ____    ____  __   __   ____/\
            / __ \  / __ \ | | / /  / __  /
		   / / / / / /_/ / | |/ /  / /_/ /
		  /_/ /_/  \____/  |___/   \__ ,/
			   good luck and no bug
________________________________________________________________________________
`
	}
	if AppSays == "" {
		AppSays = `
` + appStrUp + `
├----------------------------------
├── app name  	: ` + appName + `
├── author name : ` + author + `
├── app version	: ` + appVersion + `
├── gin       	: v1.4.0-dev
├── GoVersion 	: ` + runtime.Version() + `
├── NumCPU    	: ` + strconv.Itoa(runtime.NumCPU()) + `
├── GOPATH    	: /go/
├── GOROOT    	: /usr/local/go
└── Date      	: ` + buildTime + `
`
	}

	color.Set(color.FgGreen, color.Bold)
	defer color.Unset()
	color.Set(color.FgHiCyan, color.Bold)
	fmt.Println(AppSays)
}
