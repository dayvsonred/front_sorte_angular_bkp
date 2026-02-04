variable "aws_region" {
  type        = string
  description = "AWS region for S3 bucket."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Name used to build resource names."
  default     = "front-sorte-doacao"
}

variable "bucket_name" {
  type        = string
  description = "S3 bucket name for the Angular build."
}

variable "price_class" {
  type        = string
  description = "CloudFront price class."
  default     = "PriceClass_100"
}
