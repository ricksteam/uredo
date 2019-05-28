export default class CommandExecutor {
  constructor() {
    this.didStack = [];
    this.undidStack = [];
  }
  do(command) {
    this.undidStack = [];
    this.didStack.push(command);
    command.do();
  }
  undo() {
    let toUndo = {};
    do {
      if (this.didStack.length == 0) return;
      toUndo = this.didStack.splice(this.didStack.length - 1, 1)[0];
      toUndo.undo();
      this.undidStack.push(toUndo);
    } while (toUndo.includeWithPrevious == true);
  }
  redo() {
    let toRedo = {};

    if (this.undidStack.length == 0) return;
    toRedo = this.undidStack.splice(this.undidStack.length - 1, 1)[0];
    toRedo.do();
    this.didStack.push(toRedo);

    //Now check to see if the following ones can also be redone
    while (this.undidStack.length != 0 && this.undidStack[this.undidStack.length - 1].includeWithPrevious) {
      toRedo = this.undidStack.splice(this.undidStack.length - 1, 1)[0];
      toRedo.do();
      this.didStack.push(toRedo);
    }


  }
  canUndo() {
    return this.didStack.length != 0;
  }
  canRedo() {
    return this.undidStack.length != 0;
  }
}
