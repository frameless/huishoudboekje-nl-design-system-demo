variable "secret_name" {
  type = string
  description = "Name of the secret"
  sensitive   = true
}

variable "secret_value" {
  type = string
  description = "Value of the secret"
  sensitive   = true
}

variable "key_vault_id" {
  type        = string
  description = "ID of the key vault."
}   