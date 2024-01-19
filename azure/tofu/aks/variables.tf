variable "location" {
  type = string
  description = "The location in which the AKS cluster should be"
}

variable "resource_group_id" {
  type = string
  description = "The id of the resource group that AKS cluster should be in"
}
variable "resource_group_name" {
  type = string
  description = "The name of the resource group that AKS cluster should be in"
}

variable "name" {
    type = string
    description = "Name for the AKS cluster"
}

variable "dns_prefix" {
  type = string
  description = "Prefix to use for DNS"
}

variable "ssh_key_name" {
  type = string
  description = "Name for the SSH key that will be attached to the AKS cluster"
}

variable "vm_size" {
  type = string
  description = "The chosen VM size for the node pool"
}

variable "default_pool_vm_size" {
  type = string
  description = "Chosen VM size for the default node pool"
}

variable "admin_username" {
  type = string
  description = "Name for the linux admin"
}

variable "max_nodes" {
    type = number
    description = "The max amount of nodes in the node pool"
}

variable "min_nodes" {
    type = number
    description = "The min amount of nodes in the node pool"
}

variable "vnet_name" {
  type = string
  description = "Name of the vnet to put the AKS in"
}

variable "subnet_name" {
  type = string
  description = "Name of the subnet"
}

variable "vnet_address_space" {
  type = list(string)
  description = "The address space for the vnet"
  default = ["10.0.0.0/16"]
}

variable "subnet_address_prefixes" {
  type = list(string)
  description = "address prefixes for the subnet"
  default = ["10.0.1.0/24"]
}

variable "admin_group" {
    type = list(string)
    description = "list of admins that can manage the AKS cluster"
    default = []
}