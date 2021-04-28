from pathlib import Path
import os
from git import Repo

def get_repo(path="."):
	return Repo(path)

def add_commit(repo, files=["."], message="何かを修正"):
	repo.index.add(files)
	repo.index.commit(message)

def push(repo):
	repo.remote().push("main")