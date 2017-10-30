import operator
from functools import reduce

a = (0.8,0.9,0,0.6)
f = lambda a,b: a if (a == 0 or b == 0)  else a * b
print(0.8*0.9*0.6)
print(round(reduce(f, a, 1),2))