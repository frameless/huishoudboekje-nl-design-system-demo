terraform {
  required_version = ">=0.12"
  required_providers {
    
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.12.1"
    }
    gitlab = {
        source = "gitlabhq/gitlab"
        version = ">= 16.8.0"
    }
  }
    backend "azurerm" {}
}

provider "gitlab" {
  token = var.gitlab_token
}


provider "helm" {
  debug = var.helm_debug
  kubernetes {
    host                   = var.admin_client_host
    client_certificate     = base64decode(var.admin_client_certificate)
    client_key             = base64decode(var.admin_client_key)
    cluster_ca_certificate = base64decode(var.admin_client_ca_certificate)
  }
}


data "gitlab_project" "gitlab_project" {
  path_with_namespace = var.gitlab_namespace
}

resource "gitlab_cluster_agent" "cluster_agent" {
  project = data.gitlab_project.gitlab_project.id
  name    = "hhb-development"
}

resource "gitlab_cluster_agent_token" "agent_token" {
  project     = data.gitlab_project.gitlab_project.id
  agent_id    = gitlab_cluster_agent.cluster_agent.agent_id
  name        = "hhb-development-token"
  description = "Token for the hhb-development used with `gitlab-agent` Helm Chart"
}

resource "helm_release" "gitlab_agent" {
  name             = "gitlab-agent"
  namespace        = "gitlab-agent"
  create_namespace = true
  repository       = "https://charts.gitlab.io"
  chart            = "gitlab-agent"
  version          = "1.2.0"

  set {
    name  = "config.token"
    value = gitlab_cluster_agent_token.agent_token.token
  }
}