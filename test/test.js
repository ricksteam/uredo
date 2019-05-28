const assert = require("assert");
const expect = require("chai").expect;
import CommandExecutor from "../index.js";
import { timingSafeEqual } from "crypto";

let commands = new CommandExecutor();

describe('CommandExecutor', () => {
  describe('Initial State', () => {
    it("starts with empty stacks", () => {
      expect(commands.canUndo()).to.equal(false);
      expect(commands.canRedo()).to.equal(false);
    })
  });

  describe('Adding a command and redo and then undo', () => {
    it("accepts a valid command", () => {
      let a = 0;
      let c = {
        do: () => a = 1,
        undo: () => a = 0
      };
      commands.do(c);
      expect(commands.canUndo()).to.equal(true);
      expect(commands.canRedo()).to.equal(false);
      expect(a).to.equal(1);

      commands.undo();

      expect(commands.canUndo()).to.equal(false);
      expect(commands.canRedo()).to.equal(true);
      expect(a).to.equal(0);

      commands.redo();
      expect(commands.canUndo()).to.equal(true);
      expect(commands.canRedo()).to.equal(false);
      expect(a).to.equal(1);


    })
  });

  describe('Error handling', ()=>{
    it('rejects bad commands',()=>{
      let a = 0;
      let c = {
        do: () => a = 1,
      };
      expect(()=>commands.do(c)).to.throw("Command objects must implement both a do() and undo() function.");
      
    })
  });
});
