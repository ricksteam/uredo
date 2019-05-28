/**
 * Class that implements an undo/redo stack.
 * To use, pass an object to the do function that has at least two paramaterless functions, do() and undo().
 * If the object have a member variable includeWithPrevious set to true, the undo and redo stack will treat 
 * command as an incremental command that should be done/redone with the previous command.
 */
export default class CommandExecutor {
  constructor() {
    this.didStack = [];
    this.undidStack = [];
  }
  /**
   * 
   * Execute a command and place it on the undo stack. Also clears the redo stack()
   * 
   * @param {object} command An object with two parameterless functions, do() and undo()
   */
  do(command) {
    this.undidStack = [];
    this.didStack.push(command);
    command.do();
  }

  /**
   * Pop the last item on the undo stack, call its undo function, and push it on the redo stack. 
   * Throws an error if there is no undo stack.
   * If the last object was the includeWithPrevious flag set, it will undo the previous command
   * until the undo stack is empty or a command is found without the includeWithPrevious or a command
   * with that flag set to false.
   */
  undo() {
    let toUndo = {};
    do {
      if (this.didStack.length == 0) return;
      toUndo = this.didStack.splice(this.didStack.length - 1, 1)[0];
      toUndo.undo();
      this.undidStack.push(toUndo);
    } while (toUndo.includeWithPrevious == true);
  }
  /**
   * Pop the last item off the redo stack, call its do() functions, and push it on the undo stack.
   * Throws an error if there is no redo stack.
   * If the following object(s) have the includeWithPrevious flag set, it will redo the following commands
   * until the redo stack is empty or a command is found with the includeWithPrevious flag or a command 
   * with that flag set to false.
   */
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
  /**
   * Check to see if the undo stack has at least one object.
   */
  canUndo() {
    return this.didStack.length != 0;
  }
  /**
   * Check to see if the redo stack has at least one object.
   */
  canRedo() {
    return this.undidStack.length != 0;
  }
}
