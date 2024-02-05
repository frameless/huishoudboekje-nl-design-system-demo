terraform {
  required_version = "~> 1.3"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.48"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_dns_zone" "dns_zone" {
  name                = var.name
  resource_group_name = var.resource_group_name
  dynamic "soa_record" {
    for_each = var.soa_record != null ? [1]  : []
    content {
      email         = var.soa_record.email
      host_name     = var.soa_record.host_name
      expire_time   =   var.soa_record.expire_time
      minimum_ttl   =   var.soa_record.minimum_ttl
      refresh_time  =   var.soa_record.refresh_time
      retry_time    =   var.soa_record.retry_time
      serial_number = var.soa_record.serial_number
      ttl           = var.soa_record.ttl
      tags          = var.soa.tags
    }
  }
}