variable "admin_client_certificate" {
  type        = string
  description = "The admin client certificate that is used by kubectl"
}

variable "admin_client_key" {
  type        = string
  description = "The admin client key that is used by kubectl"
}

variable "admin_client_ca_certificate" {
  type        = string
  description = "The admin client ca certificate that is used by kubectl"
}

variable "admin_client_host" {
  type        = string
  description = "The host for the admin client"
}

variable "helm_debug" {
  type        = bool
  description = "Run helm provider in debug or not, default to false"
  default     = false
}

variable "k8s_namespace_name" {
  type = string
  description = "Name for the namespace that will contain ingress"
}

variable "public_ip" {
  type = string
  description = "The public ip address that the ingress loadbalancer will run on"
}