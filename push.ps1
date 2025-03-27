param(
    [Parameter(Mandatory=$false)]
    [string]$message = "Updated files"
)

git add --all
git commit -m "$message"
git push -u origin main

Write-Host "Successfully committed with message: '$message' and pushed to origin main" -ForegroundColor Green 