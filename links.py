from huggingface_hub import HfApi

# Prompt the user to enter the full Hugging Face repository path
repo_url = input("Enter the full Hugging Face repository path (e.g., https://huggingface.co/roktimsardar123/temp/tree/main/folder): ")

# Extract repo ID and path inside repo
parts = repo_url.replace("https://huggingface.co/", "").split("/tree/main/")
repo_id = parts[0]
repo_path = parts[1] if len(parts) > 1 else ""

# Initialize the API client
api = HfApi()

# Fetch the list of files in the repository
files = api.list_repo_files(repo_id=repo_id)

# Filter files inside the specified folder
if repo_path:
    files = [file for file in files if file.startswith(repo_path)]

# Base URL for downloading files
base_url = f"https://huggingface.co/{repo_id}/resolve/main/"

# Generate full download URLs
download_links = [base_url + file for file in files]

# Save the download links to links.txt
with open("links.txt", "w") as file:
    for link in download_links:
        file.write(link + "\n")

print(f"Download links have been saved to links.txt")
