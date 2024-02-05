variable "name" {
  type = string
  description = "Domain name, for example contoso.xyz"
}

variable "resource_group_name" {
  type = string
  description = "Name of the resource group for this dns_zone"
}

variable "soa_record" {
  type = object({
    email = string
    host_name = optional(string)
    expire_time = optional(number)
    minimum_ttl = optional(number)
    refresh_time = optional(number)
    retry_time = optional(number)
    serial_number = optional(number)
    ttl = optional(number)
    tags = optional(string)
  })
  description = "The soa lookup record that is used when looking up the dns"
  default = null
}