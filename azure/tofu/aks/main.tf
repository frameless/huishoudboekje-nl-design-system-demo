terraform {
  required_version = "~> 1.3"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.48"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~> 1.11.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.47.0"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

data "azuread_client_config" "current" {}


resource "azapi_resource_action" "ssh_public_key_gen" {
  type        = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  resource_id = azapi_resource.ssh_public_key.id
  action      = "generateKeyPair"
  method      = "POST"

  response_export_values = ["publicKey", "privateKey"]
}

resource "azapi_resource" "ssh_public_key" {
  type      = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  name      = var.ssh_key_name
  location  = var.location
  parent_id = var.resource_group_id
}


resource "azurerm_kubernetes_cluster" "k8s" {
  location            = var.location
  name                = var.name
  resource_group_name = var.resource_group_name
  dns_prefix          = var.dns_prefix

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = var.default_pool_vm_size
    type       = "VirtualMachineScaleSets"
    node_count = 1
  }
  linux_profile {
    admin_username = var.admin_username

    ssh_key {
      key_data = jsondecode(azapi_resource_action.ssh_public_key_gen.output).publicKey
    }
  }

  network_profile {
    load_balancer_sku = "standard"
    outbound_type     = "loadBalancer"
    network_plugin    = "azure"
    network_policy    = "calico"
    dns_service_ip    = "10.0.0.10"
    service_cidr      = "10.0.0.0/16"
  }
  azure_active_directory_role_based_access_control {
    managed                = true
    azure_rbac_enabled     = true
    admin_group_object_ids = concat([data.azuread_client_config.current.object_id], var.admin_group)
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "node_pool" {
  for_each              = {
    for index , pool in var.node_pools:
      pool.name => pool
  }
  name                  = each.value.name
  kubernetes_cluster_id = azurerm_kubernetes_cluster.k8s.id
  vm_size               = each.value.vm_size
  enable_auto_scaling   = each.value.enable_auto_scaling
  node_count            = each.value.enable_auto_scaling ? null : each.value.max_nodes
  max_count             = each.value.enable_auto_scaling ? each.value.max_nodes : null
  min_count             = each.value.enable_auto_scaling ? each.value.min_nodes : null
  node_labels           = each.value.labels

  // Ignore node_count changes because of auto-scaling
  lifecycle {
    ignore_changes = [
      node_count
    ]
  }
}

