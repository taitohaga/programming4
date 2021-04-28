from l4 import *

def main():
	import matplotlib.pyplot as plt
	import numpy as np

	x = np.arange(-1000, 1000)
	y = x**3 / 1000 - x**2

	plt.figure()
	plt.plot(x, y)
	
	#plt.show()
	plt.savefig("images/graph.png")

	repo = get_repo()
	add_commit(repo, files=["images/graph.png"], message="l4 グラフ作成と保存")
	push(repo)

if __name__ == "__main__":
	main()