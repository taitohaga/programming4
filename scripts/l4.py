from pathlib import Path
import os
from git import Repo

def get_repo(path="."):
	return Repo(path)

def add_commit(repo, files=["."], message="何かを修正"):
	repo.index.add(files)
	repo.index.commit(message)

def make_key_sh():
	ssh_key_path = os.path.join(str(Path.home()), ".ssh", "id_rsa")
	with open("../../id_rsa_tmp", "w") as f:
		with open(ssh_key_path) as k:
			key = k.read()
		f.write(key)
		os.chmod("../id_rsa_tmp", 0o600)
	with open("../ssh_cmd.sh", "w") as f:
		f.write("ssh -T -i ./id_rsa_tmp -o git@github.com")
		os.chmod("../ssh_cmd.sh", 0o777)

def push(repo):
	make_key_sh()
	ssh_executable = "../ssh_cmd.sh"
	with repo.git.custom_environment(GIT_SSH=ssh_executable):
		repo.remote().push("main")