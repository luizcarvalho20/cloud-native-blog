$SUB="6a44114d-b9c7-4c7b-8a32-e40b44a2ae7b"
$RG="rg-cloud-native-blog"
$STG="stgcnb87646luiz"
$POSTS_CONTAINER="posts"

$STG_CONN = az storage account show-connection-string `
  --subscription $SUB `
  -g $RG `
  -n $STG `
  --query connectionString -o tsv
