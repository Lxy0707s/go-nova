#!/bin/sh

# shellcheck disable=SC2164
cd demo/internal/graphql

echo "3秒后将在服务器 $(echo $(hostname)) 部署项目，3秒内你还有退出机会"
sleep 3

run gqlgen

echo "开始生成graphql服务"
sleep 15

cd ../../../app
echo "开始打包"
# go build 打出可执行二进制文件
CMD=$(basename $PWD)
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -mod vendor -v -o demo ${CMD}

echo "调用模板生成容器配置"


echo "生成容器"

echo "构建并启动容器"