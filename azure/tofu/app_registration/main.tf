terraform {
  required_version = "~> 1.3"

  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.36"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

data "azuread_client_config" "current" {}

resource "azuread_application" "application" {
  display_name     = var.name
  owners           = concat([data.azuread_client_config.current.object_id], var.owners)
  sign_in_audience = "AzureADMyOrg"
  identifier_uris  = ["api://${var.name}-auth"]

  api {
    requested_access_token_version = 2

      oauth2_permission_scope {
      admin_consent_description  = "Default user access to all environments for hhb-development"
      admin_consent_display_name = "Access to HHB development environments"
      enabled                    = true
      id                         = random_uuid.oath2_uuid.result
      type                       = "Admin"
      user_consent_description   = "Default user access to all environments for hhb-development"
      user_consent_display_name  = "Access to HHB development environments"
      value                      = "default"
    }
  }

  app_role {
    allowed_member_types = ["Application", "User"]
    description          = "Default application app role"
    display_name         = "Default"
    enabled              = true
    id                   = random_uuid.app_role_uuid.result
    value                = "Default.Access"
  }

  web {
    redirect_uris = var.redirect_uris
    implicit_grant {
      access_token_issuance_enabled = true
      id_token_issuance_enabled = false
    }
  }


  lifecycle {
    ignore_changes = [ 
      web[0].redirect_uris
     ]
  }
}

resource "azuread_application_password" "secret" {
  application_id = azuread_application.application.id
}


resource "random_uuid" "app_role_uuid" {}

resource "random_uuid" "oath2_uuid" {}