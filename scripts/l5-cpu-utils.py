# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: light
#       format_version: '1.5'
#       jupytext_version: 1.11.3
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

import psutil
import matplotlib.pyplot as plt
import numpy as np

cpu_usage = []
for i in range(10):
    cpu_usage.append(psutil.cpu_percent(1))
    plt.plot(np.arange(0, len(cpu_usage), 1), cpu_usage)
    plt.show()

cpu_usage = []
for i in range(20):
    plt.clf()
    cpu_usage.append(psutil.cpu_percent(1))
    if len(cpu_usage) > 6:
        del cpu_usage[0]
    plt.plot(np.arange(0, len(cpu_usage), 1), cpu_usage)
    plt.show()

cpu_usage = []
history_max = 5
observe_time = 20
for i in range(observe_time):
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
    # plt.show()
    plt.savefig("graph_{}-{}.png".format(i, observe_time))
