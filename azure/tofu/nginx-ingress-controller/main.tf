terraform {
  required_version = ">=0.12"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.48"
    }
    azuread = {
      version = ">= 2.47.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.25.2"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.12.1"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14.0"
    }
  }
    backend "azurerm" {}
}

provider "kubernetes" {
  host                   = var.admin_client_host
  client_certificate     = base64decode(var.admin_client_certificate)
  client_key             = base64decode(var.admin_client_key)
  cluster_ca_certificate = base64decode(var.admin_client_ca_certificate)
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

provider "kubectl" {
  host                   = var.admin_client_host
  client_certificate     = base64decode(var.admin_client_certificate)
  client_key             = base64decode(var.admin_client_key)
  cluster_ca_certificate = base64decode(var.admin_client_ca_certificate)
  load_config_file       = false
}

resource "kubernetes_namespace" "ingress" {
    metadata {
      name = var.k8s_namespace_name
    }
}

resource "helm_release" "ingress" {
  name = "ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart = "ingress-nginx"
  namespace = kubernetes_namespace.ingress.metadata.0.name
  set {
    name = "controller.service.loadBalancerIP"
    value = var.public_ip
  }
  set {
    name = "controller.service.annotations.\"service\\.beta\\.kubernetes\\.io/azure-load-balancer-health-probe-request-path\""
    value = "/healthz"
  }
  depends_on = [ kubernetes_namespace.ingress ]
}

resource "helm_release" "cert_manager" {
  name = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart = "cert-manager"
  namespace = "cert-manager"
  create_namespace = true
  set {
    name = "installCRDs"
    value = true
  } 
}

resource "kubectl_manifest" "letsencrypt" {
  yaml_body = <<EOT
  apiVersion: cert-manager.io/v1
  kind: ClusterIssuer
  metadata:
    name: letsencrypt-staging
  spec:
    acme:
      # The ACME server URL
      server: https://acme-v02.api.letsencrypt.org/directory
      # Email address used for ACME registration
      email: bauke.huijbers2@utrecht.nl
      # Name of a secret used to store the ACME account private key
      privateKeySecretRef:
        name: letsencrypt-staging
      # Enable the HTTP-01 challenge provider
      solvers:
        - http01:
            ingress:
              ingressClassName: nginx
EOT
}
