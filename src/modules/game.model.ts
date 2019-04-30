interface IGameAssets {
  skierCrash: string;
  skierLeft: string;
  skierLeftDown: string;
  skierDown: string;
  skierRightDown: string;
  skierRight: string;
  tree: string;
  treeCluster: string;
  rock1: string;
  rock2: string;
  jumpRamp: string;
  skierJump1: string;
  skierJump2: string;
  skierJump3: string;
  skierJump4: string;
  skierJump5: string;
}

interface IGameBoundaries {
  leftEdge: number;
  rightEdge: number;
  topEdge: number;
  bottomEdge: number;
}

interface IRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export {
  IGameAssets,
  IGameBoundaries,
  IRect
}