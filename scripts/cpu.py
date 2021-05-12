import psutil
import matplotlib.pyplot as plt
import numpy as np

cpu_usage = []
history_max = 5
i = 0

while True:
    plt.clf()
    plt.figure()
    plt.title("CPU Usage")
    plt.xlabel("sec")
    plt.ylabel("usage (%)")
    plt.xlim(0, 5)
    plt.ylim(0, 100)
    if len(cpu_usage) > history_max:
        del cpu_usage[0]
    cpu_usage.append(psutil.cpu_percent(1))
    plt.plot(np.arange(0, len(cpu_usage), 1), cpu_usage)
    plt.savefig("graph.png".format(i))
    i += 1

