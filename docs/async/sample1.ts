import { FuncA, FuncB, FuncC, FuncD, FuncE, FuncF, PromiseResult, NodePromise } from './common';

const Answer1 = async () => {  
  const a = await FuncA();
  const b = await FuncB();
  const c = await FuncC();
  const d = await FuncD(a, b);
  const e = await FuncE(b, c);
  return FuncF(d, e);
}

const Answer2 = async () => {
  const [a, b, c] = await Promise.all([FuncA(), FuncB(), FuncC()]); 
  const d = await FuncD(a, b);
  const e = await FuncE(b, c);
  return FuncF(d, e);
}

const Answer3 = async () => {
  const [a, b, c] = await Promise.all([FuncA(), FuncB(), FuncC()]); 
  const [d, e] = await Promise.all([FuncD(a,b), FuncE(b,c)]);
  return FuncF(d, e);
}

const Answer4 = async () => {
  const b = await FuncB();
  const [d, e] = await Promise.all([
    FuncA().then(a => FuncD(a, b)), 
    FuncC().then(c => FuncE(b, c))
  ]);
  return FuncF(d, e);
}

const Answer5 = async () => {
  const promiseA = FuncA();
  const promiseC = FuncC();
  const b = await FuncB();
  const [d, e] = await Promise.all([
    promiseA.then(a => FuncD(a, b)), 
    promiseC.then(c => FuncE(b, c))
  ]);
  return FuncF(d, e);
}

const Answer6 = async () => {
  const promiseA = FuncA();
  const promiseC = FuncC();
  const b = await FuncB();
  const AthenD = async () => {
    const a = await promiseA;
    return FuncD(a, b);
  }
  const CthenE = async () => {
    const c = await promiseC;
    return FuncE(b, c);
  }
  const [d, e] = await Promise.all([AthenD(), CthenE()]);
  return FuncF(d, e);
}

const Answer7 = async () => {
  const promiseA = FuncA();
  const promiseC = FuncC();
  const promiseB = FuncB();
  const promiseD = (async () => {
    const [a, b] = await Promise.all([promiseA, promiseB]);
    return FuncD(a, b);
  })();
  const promiseE = (async () => {
    const [b, c] = await Promise.all([promiseB, promiseC]);
    return FuncE(b, c);
  })();
  const promiseF = (async () => {
    const [d, e] = await Promise.all([promiseD, promiseE]);
    return FuncF(d, e);
  })();
  return promiseF;
}

const computed = async (nodes: NodePromise[], func: (...arg: PromiseResult[]) => NodePromise) => {
  const results = await Promise.all(nodes);
  return func(...results);
};

const Answer8 = async () => {
  const nodeA = FuncA();
  const nodeB = FuncB();
  const nodeC = FuncC();
  const nodeD = computed([nodeA, nodeB], FuncD);
  const nodeE = computed([nodeB, nodeC], FuncE);
  const nodeF = computed([nodeD, nodeE], FuncF);
  return nodeF;
}

const Answer9 = async () => {
  const nodeA = FuncA();
  const nodeB = FuncB();
  const nodeC = FuncC();
  const nodeD = FuncD(await nodeA, await nodeB);
  const nodeE = FuncE(await nodeB, await nodeC);
  const nodeF = FuncF(await nodeD, await nodeE);
  return nodeF;
}

const timer = async (p: NodePromise) => {
  const now = Date.now();
  const result = await p;
  return { time: Date.now() - now, ...result };
}

const main = async () => {
  console.log(await timer(Answer1()));
  console.log(await timer(Answer2()));
  console.log(await timer(Answer3()));
  console.log(await timer(Answer4()));
  console.log(await timer(Answer5()));
  console.log(await timer(Answer6()));
  console.log(await timer(Answer7()));
  console.log(await timer(Answer8()));
  console.log(await timer(Answer9()));
};

if (process.argv[1] === __filename) {
  main();
}
  
