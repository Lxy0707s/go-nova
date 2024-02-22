#!/usr/bin/env bash
# 服务生成脚本
# 使用说明：./server_generate.sh [新系统名，例如：aegis] [新服务名，例如：demo] [新服务口：对应注册在all_app_port.sh的服务口，例，65] [要复制样板源项目：demoagent]
# ./server_generate.sh perseus decisioncenter 80 demoagent

if [[ $1 == "" ]]; then
  echo "先设置要服务生成后要放到哪个系统，比如nova"
  exit
fi

if [[ $3 == "" ]]; then
  echo "先设置要服务在app_port.sh中设置的端口号"
  exit
fi

if [[ $4 == "" ]]; then
  echo "先设置生成依据的模板来源，比如demo"
  exit
fi

cd ../../../cmd/
app_path=$(pwd)
cd demo
if [[ ! -d $4 ]]; then
  echo "目标模板项目不存在"
  exit
fi
new_project_path=${app_path}/$1

mkdir -p ${new_project_path}
cp -R $4/* ${new_project_path}
#删除demo的内部化文件
cd ${new_project_path}/runtime
rm -rf $(ls . | grep -v '.gitignore')
cd ${new_project_path}/build/rpm
rm -rf $(ls . | grep -v 'rpmbuilder')
cd ${new_project_path}/build/docker/logs
rm -rf $(ls . | grep -v '.gitignore')
cd ${new_project_path}/build/docker/data
rm -rf $(ls . | grep -v '.gitignore')
rm -f ${new_project_path}/cmd/nohup.out
rm -f ${new_project_path}/.env
rm -rf ${new_project_path}/test
# 为sed设置环境变量避免报错
export LC_CTYPE=C
#对指定文件替换到新项目端口
dport=0
cmd_name="0"
case "$4" in
demo)
  dport=34
  ;;
demoagent)
  dport=35
  ;;
*)
  echo "no init shortcut key"
  exit
  ;;
esac
echo "进行新端口替换"
sed -i '' "s/80${dport}/80$3/g" ${new_project_path}/build/docker/etc/nginx/vhost/backend.conf
sed -i '' "s/80${dport}/80$3/g" ${new_project_path}/build/k8s/*.yaml
sed -i '' "s/80${dport}/80$3/g" ${new_project_path}/internal/app/env.go
sed -i '' "s/${dport}/$3/g" ${new_project_path}/build/docker/etc/nginx/vhost/frontend.conf
sed -i '' "s/${dport}/$3/g" ${new_project_path}/web/bsy.json
sed -i '' "s/${dport}/$3/g" ${new_project_path}/web/src/config/domain.js
sed -i '' "s/80${dport}/80$3/g" ${new_project_path}/cmd/config.yml
sed -i '' "s/90${dport}/90$3/g" ${new_project_path}/cmd/config.yml
sed -i '' "s/aegis/$1/g" ${new_project_path}/cmd/config.yml
sed -i '' "s/$4/g" ${new_project_path}/cmd/config.yml
sed -i '' "s/80${dport}/80$3/g" ${new_project_path}/internal/app/env.go
sed -i '' "s/80${dport}/80$3/g" ${new_project_path}/build/rpm/rpmbuilder/*.yml

#整理新环境文件
mv ${new_project_path}/build/docker/compose/docker-compose-aegis-$4.yml ${new_project_path}/build/docker/compose/docker-compose-$1.yml
mv ${new_project_path}/build/docker/compose/docker-compose-aegis-$4-pro.yml ${new_project_path}/build/docker/compose/docker-compose-$1-pro.yml
mv ${new_project_path}/build/rpm/rpmbuilder/aegis-$4.conf ${new_project_path}/build/rpm/rpmbuilder/$1.conf
mv ${new_project_path}/build/rpm/rpmbuilder/aegis-$4.service ${new_project_path}/build/rpm/rpmbuilder/$1.service
mv ${new_project_path}/build/rpm/rpmbuilder/aegis_$4_config_pro.yml ${new_project_path}/build/rpm/rpmbuilder/$1_config_pro.yml

#全局性替换包路径
sed -i '' "s/$4/g" ${new_project_path}/cmd/zeus.go
sed -i '' "s/aegis/$1/g" ${new_project_path}/cmd/zeus.go

sed -i '' "s/aegis/$1/g" ${new_project_path}/cmd/.gitignore
sed -i '' "s/$4/g" ${new_project_path}/cmd/.gitignore

sed -i '' "s/aegis/$1/g" ${new_project_path}/build/rpm/rpmbuilder/$1.conf
sed -i '' "s/$4/g" ${new_project_path}/build/rpm/rpmbuilder/$1.conf

sed -i '' "s/aegis/$1/g" ${new_project_path}/build/rpm/rpmbuilder/$1.service
sed -i '' "s/$4/g" ${new_project_path}/build/rpm/rpmbuilder/$1.service

sed -i '' "s/aegis/$1/g" ${new_project_path}/build/k8s/*.yaml
sed -i '' "s/$4/g" ${new_project_path}/build/k8s/*.yaml

sed -i '' "s/aegis/$1/g" ${new_project_path}/build/rpm/rpmbuilder/$1_config_pro.yml
sed -i '' "s/$4/g" ${new_project_path}/build/rpm/rpmbuilder/$1_config_pro.yml

sed -i '' "s/aegis/$1/g" ${new_project_path}/build/rpm/rpmbuilder/rpm.spec
sed -i '' "s/$4/g" ${new_project_path}/build/rpm/rpmbuilder/rpm.spec

sed -i '' "s/$4/g" ${new_project_path}/cmd/.gitignore
sed -i '' "s/aegis-$4/$1/g" ${new_project_path}/README.md
grep -rl "app/aegis/$4" ${new_project_path} | xargs sed -i '' "s/app\/aegis\/$4/app\/$1\/g"

echo "去掉无用文件"
rm -rf ${new_project_path}/assets/databases/sql/base/*
rm -rf ${new_project_path}/assets/image/*
rm -rf ${new_project_path}/assets/swagger
rm -rf ${new_project_path}/build/docker/etc/*
rm -rf ${new_project_path}/build/README.md
echo $(sed '10,$d' ${new_project_path}/internal/dao/mysql.go) >${new_project_path}/internal/dao/mysql.go

