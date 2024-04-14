Hashicorp's Terraform is an open-source tool for provisioning and managing cloud infrastructure. Terraform can provision resources on any cloud platform. 
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/4c33748b-7f0e-42b5-8180-aadefb542913)

Terraform allows you to create infrastructure in configuration files(tf files) that describe the topology of cloud resources. These resources include virtual machines, storage accounts, and networking interfaces. The Terraform CLI provides a simple mechanism to deploy and version the configuration files to Azure.
Advantages of using Terraform:
•	Reduce manual human errors while deploying and managing infrastructure.
•	Deploys the same template multiple times to create identical development, test, and production environments.
•	Reduces the cost of development and test environments by creating them on-demand.
How to Authenticate with Azure?
Terraform can authenticate with Azure in many ways, in this example we will use Azure CLI to authenticate with Azure and then we will 

create resources using Terraform.
Pre-requisites:
Azure CLI needs to be installed.
Terraform needs to be installed.
Logging into the Azure CLI
Login to the Azure CLI using:
az login
The above command will open the browser and will ask your Microsoft account details. Once you logged in, you can see the account info by executing below command:
az account list
Now create a directory to store Terraform files.
mkdir azure-terraform
cd azure-terraform
Let's create a terraform file to use azure provider. To configure Terraform to use the Default Subscription defined in the Azure CLI, use the below cod.
Create providers.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.38.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}
Now initialize the working directory
Perform the below command:
terraform init
Once directory is initialized, you can start writing code for setting up the infrastructure. 
Create Resource Group,ACR,AKS using Terraform script
create-main.tf
resource "azurerm_resource_group" "aks-rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_role_assignment" "role_acrpull" {
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "owner"
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity.0.object_id
  skip_service_principal_aad_check = true
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.aks-rg.name
  location            = var.location
  sku                 = "Standard"
  admin_enabled       = false
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  kubernetes_version  = var.kubernetes_version
  location            = var.location
  resource_group_name = azurerm_resource_group.aks-rg.name
  dns_prefix          = var.cluster_name

  default_node_pool {
    name                = "system"
    node_count          = var.system_node_count
    vm_size             = "Standard_DS2_v2"
    type                = "VirtualMachineScaleSets"
    zones  = [1,2,]
    enable_auto_scaling = false
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    load_balancer_sku = "standard"
    network_plugin    = "kubenet" 
  }
}

Now Perform the below command to validate terraform files.
terraform validate

 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/70a3af8d-98f1-404d-aa7f-7f1118330e78)

perform plan command to see how many resources will be created.
terraform plan
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/5fc1cfd6-ca08-404e-b71e-94e41caa4b2d)

terraform apply
Do you want to perform these actions?
type yes 
![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/227c2ac6-bae8-40b6-85f4-5968bfc09a6f)

 
 
Now Login into Azure Cloud to see all the resources created.
 

 
![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/c00c5b91-cc9f-4478-9c70-790216c58521)

![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/4baf31f4-3b2b-4251-9b4b-48fe569ca400)


 

build Docker image and upload the Docker images into Azure Container Registry(ACR) using Azure Build pipelines.

![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/d41a7cb8-f647-4340-a99a-c554d6e2caa1)

 
Pre-requisites:
1. ACR is setup in Azure cloud. (see below for the steps)
2. Already created Azure DevOps dashboard in 
https://dev.azure.com/
3. Dockerfile created along with the application source code

How to Create Azure Container Registry?

First Create Resource Group
Make sure you are login to Azure portal first.
az login
Execute below command to create a resource group in Azure portal.

az group create --name myResourceGroup --location southcentralus
Run the below command to create your own private container registry using Azure Container Registry (ACR).
az acr create --resource-group myResourceGroup --name myacrrepo31 --sku Standard --location southcentralus
You can login to Azure portal to see the ACR repo.

Next i added a docker file to my node js application and built an image from it and tag it
docker build . -t shecloud
docker tag shecloud <loginservername/shecloud>

![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/5622f04d-bfd3-4985-9126-52ea57fe7a76)

 
Check built images with
docker images
![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/36b74a91-6d7b-4b7c-b592-380ec8e586e4)


 
Next we had to log into the regisrty using docker
docker login <login server name>
To see your server username an password, enable the button.
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/c71f00ee-72df-42fa-b7b8-470d10bab39f)

 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/8da16b52-20f8-4188-94bb-53302902e8d0)

 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/ba4e71eb-349d-4d77-9b55-a7e9531cd5f2)

To see your registry loginserver
![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/2f7cc936-f3a6-4406-ab15-174e79a24cfa)

 
docker push shecloud <loginservername>/shecloud
![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/a9799abb-92fa-4d58-a1c7-efa97dfe3a06)

 
After pushing, we should be able to see out image under repositories in the Azure Container registry.
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/d9a3753b-c200-4ee4-be1e-feab3efa4266)

Next login to be able to deploy to kubernetes.
az login
az account set --subscription xxxxxx-xxxx-xxxx-xxxxxx
az aks get-credentials --resource-group <resource group nae> --name <aks name>
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/6c04e718-c579-4a74-ad0f-dc6455674928)

kubectl get nodes
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/5f46a378-8774-4b11-a793-85144fb01ffd)

Next i deployed using this yaml file.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: cprimemyacr321012.azurecr.io/shecloud
        ports:
        - containerPort: 3000

---
apiVersion: v1
kind: Service
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  type: LoadBalancer
  ports:
  - port: 3000
    targetPort: 3000
    protocol: TCP
  selector:
    app: my-app


 kubectl apply -f node_sql.yaml
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/e9ce9439-3475-4d9b-b4cb-e5156138e9ed)

Net to see the external ip Of the app we use
kubectl get svc
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/6abef902-4ded-46e8-8785-c5a86de5d2b5)

Next we move to the portal to the database server network allow ips access.
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/6207c41b-1863-442b-a88c-3d9c0352b277)

NB: be sure to tick the box allowing services access server.
 ![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/d5f12dba-6323-4708-b5a5-5f6358a99b5e)

Click save to save the changes .
When we check the External ip 20.87.94.72:3000

![out](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/db6deffb-fc30-4663-8ed4-fdb6c189e761)



How to create a Azure Build Pipeline
![image](https://github.com/kvnmoorthy/cprimeinc/assets/93351444/72b632ce-64f4-4bbd-890f-7d91e362d53c)

1. Login into your Azure DevOps dashboard
2. Click on Pipelines.
 

3. Click on New Pipeline
 

# Starter pipeline
# Start with a minimal pipeline that you can customize to build and deploy your code.
# Add steps that build, run tests, deploy, and more:
# https://aka.ms/yaml

trigger:
- main

# pool:
#   murthy

pool:  
  name: 'murthy'

# pool:
#       vmImage: 'ubuntu-latest'

stages:
- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build
    pool: murthy
    steps:
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: 'cprimemyacr321014'
        dockerfile: '**/Dockerfile'
        containerRegistry: 'cprimemyacr321014'  # Provide your service connection here
        tags: |
          $(tag)
    - task: Kubernetes@1
      displayName: Deploy
      inputs:
        connectionType: 'Azure Resource Manager'
        azureSubscriptionEndpoint: 'murthy'
        azureResourceGroup: 'prime-rg'
        kubernetesCluster: 'cprimecluster'
        namespace: 'default'
        command: 'apply'
        useConfigurationFile: true
        configuration: '01_kubernetes_aks'
        secretType: 'dockerRegistry'
        containerRegistryType: 'Azure Container Registry'
        azureSubscriptionEndpointForSecrets: 'murthy'
        azureContainerRegistry: 'cprimemyacr321014.azurecr.io'
        forceUpdate: false
    - task: Kubernetes@1
      displayName: Destroy
      inputs:
        connectionType: 'Azure Resource Manager'
        azureSubscriptionEndpoint: 'murthy'
        azureResourceGroup: 'prime-rg'
        kubernetesCluster: 'cprimecluster'
        namespace: 'default'
        command: 'delete'
        useConfigurationFile: true
        configuration: '01_kubernetes_aks'
        secretType: 'dockerRegistry'
        containerRegistryType: 'Azure Container Registry'
        azureSubscriptionEndpointForSecrets: 'murthy'
        azureContainerRegistry: 'cprimemyacr321014.azurecr.io'
        forceUpdate: false
    - task: Kubernetes@1
      displayName: ReDeploy
      inputs:
        connectionType: 'Azure Resource Manager'
        azureSubscriptionEndpoint: 'murthy'
        azureResourceGroup: 'prime-rg'
        kubernetesCluster: 'cprimecluster'
        namespace: 'default'
        command: 'apply'
        useConfigurationFile: true
        configuration: '01_kubernetes_aks'
        secretType: 'dockerRegistry'
        containerRegistryType: 'Azure Container Registry'
        azureSubscriptionEndpointForSecrets: 'murthy'
        azureContainerRegistry: 'cprimemyacr321014.azurecr.io'
        forceUpdate: false


By running this Yaml pipeline we can Deploy,Destroy,Redeploy  our Environment
