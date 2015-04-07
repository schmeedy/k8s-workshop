#!/bin/bash
set -e

PLATFORM="$(uname -s)"
KUBERNETES_VERSION=${KUBERNETES_VERSION:-0.12.1}

KUB_URL="https://storage.googleapis.com/kubernetes-release/release/v${KUBERNETES_VERSION}/bin/$( \
  echo ${PLATFORM} | tr '[:upper:]' '[:lower:]')/amd64/kubectl"

scream () {
    cat <<< "$@" 1>&2
    exit 1
}

case "$PLATFORM" in
  Darwin)
    targetDir="/usr/local/bin"
    ;;
  Linux)
    targetDir="/usr/local/bin"
    ;;
  *)
    scream "Unknown or unsupported platform: ${PLATFORM}"
    ;;
esac

set +e
GCLOUD_KUBECTL=`which kubectl`
set -e
if [[ -f $GCLOUD_KUBECTL ]]; then
  sudo rm $GCLOUD_KUBECTL
  targetDir=`dirname $GCLOUD_KUBECTL`
fi

[ -d ${targetDir} ] || sudo mkdir -p ${targetDir}
if [ -f ${targetDir}/kubectl ]; then 
  echo "kubectl already installed"
else
  echo "downloading ${PLATFORM} version of kubectl (Kubernetes CLI) into ${targetDir}"
  sudo wget -q -L -O ${targetDir}/kubectl "${KUB_URL}"
  sudo chmod +x ${targetDir}/kubectl
fi

echo
echo "Excercise 1 - find yourself in the list"
PS3="Tell me who you are: "
options=("dusan" "juraj" "marek" "martin" "matej" "shkodran" "Exit")
select opt in "${options[@]}";
do
  if [[ $opt = "Exit" ]]; then
    exit 0
  fi

  if [[ -z $opt ]]; then
    echo "invalid option: $REPLY"
  else
    echo $opt
    NS=$opt
    break
  fi
done

kubectl config set-cluster k8s-workshop --server=http://localhost:8001 --api-version=v1beta3
kubectl config set-context default --cluster=k8s-workshop --namespace=default
kubectl config set-context $NS --cluster=k8s-workshop --namespace=$NS
kubectl config use-context $NS
mkdir -p ~/.kubes
mv .kubeconfig ~/.kube/
echo
echo "kubectl config:"
kubectl config view

echo
echo "TO TUNNEL KUBERNETES API:"
echo 'gcloud compute ssh --ssh-flag="-L 8001:k8s-workshop-master:8001" k8s-workshop-master'