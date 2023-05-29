package main

import (
	"log"

	"github.com/spf13/cobra"

	"github.com/go-nova/cmd/nova/v1/internal/change"
	"github.com/go-nova/cmd/nova/v1/internal/project"
	"github.com/go-nova/cmd/nova/v1/internal/proto"
	"github.com/go-nova/cmd/nova/v1/internal/run"
	"github.com/go-nova/cmd/nova/v1/internal/upgrade"
)

var rootCmd = &cobra.Command{
	Use:     "kratos",
	Short:   "Kratos: An elegant toolkit for Go microservices.",
	Long:    `Kratos: An elegant toolkit for Go microservices.`,
	Version: release,
}

func init() {
	rootCmd.AddCommand(project.CmdNew)
	rootCmd.AddCommand(proto.CmdProto)
	rootCmd.AddCommand(upgrade.CmdUpgrade)
	rootCmd.AddCommand(change.CmdChange)
	rootCmd.AddCommand(run.CmdRun)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		log.Fatal(err)
	}
}
