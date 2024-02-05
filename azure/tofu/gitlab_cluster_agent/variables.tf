variable "gitlab_token" {
  type = string
  description = "Gitlab access token"
}

variable "helm_debug" {
  type = bool
  description = "To run helm in debug mode or not, default to false"
  default = false
}

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
variable "gitlab_namespace" {
  type = string
  description = "The gitlab namespace path"
}
