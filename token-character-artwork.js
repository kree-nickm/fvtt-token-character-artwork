"use strict";

Hooks.once("init", () => {
   game.settings.register("token-character-artwork", "trigger", {
      name: "Preview Trigger",
      hint: "The button that needs to be pressed in order to have the artwork pop up. Note: If you select an option with no modifier key (shift, ctrl, alt), you can't pop up the artwork of your own tokens.",
      scope: "client",
      config: true,
      default: 1,
      choices: {
         // Note: Unmodified right clicks are not an option for now, because that would interfere with token targeting.
         1: "Shift + Left Click",
         2: "Shift + Right Click",
         3: "Shift + Left Double Click",
         4: "Shift + Right Double Click",
         5: "Left Click",
         //6: "Right Click",
         7: "Left Double Click",
         //8: "Right Double Click",
      },
      type: String,
   });
   
   PIXI.InteractionEvent.prototype.resumePropagation = function()
   {
      this.stopped = false;
      this.stopPropagationHint = false;
      this.stopsPropagatingAt = null;
   };
   
   Token.prototype.oldCan = function(action, event)
   {
      let fn = this["oldCan"+action];
      if ( typeof fn === "boolean" ) return fn;
      if ( fn instanceof Function ) return fn.call(this, game.user, event);
      return true;
   };
   
   libWrapper.register("token-character-artwork", "Token.prototype.activateListeners", function(wrapped, ...args) {
      wrapped(...args);
      this.oldCanClickLeft = this.mouseInteractionManager.permissions.clickLeft;
      this.oldCanClickLeft2 = this.mouseInteractionManager.permissions.clickLeft2;
      this.oldCanClickRight = this.mouseInteractionManager.permissions.clickRight;
      this.oldCanClickRight2 = this.mouseInteractionManager.permissions.clickRight2;
      this.mouseInteractionManager.permissions.clickLeft = true;
      this.mouseInteractionManager.permissions.clickLeft2 = true;
      this.mouseInteractionManager.permissions.clickRight = true;
      this.mouseInteractionManager.permissions.clickRight2 = true;
   }, "WRAPPER");
   
   libWrapper.register("token-character-artwork", "Token.prototype._onClickLeft", function(wrapped, ...args) {
      let result = Hooks.call(`clickLeftToken`, this, args[0]);
      if(result === false)
         return false;
      else if(this.oldCan("ClickLeft", args[0]))
         return wrapped(...args);
      else
         args[0].resumePropagation();
   }, "MIXED");
   
   libWrapper.register("token-character-artwork", "Token.prototype._onClickLeft2", function(wrapped, ...args) {
      let result = Hooks.call(`clickLeft2Token`, this, args[0]);
      if(result === false)
         return false;
      else if(this.oldCan("ClickLeft2", args[0]))
         return wrapped(...args);
      else
         args[0].resumePropagation();
   }, "MIXED");
   
   libWrapper.register("token-character-artwork", "Token.prototype._onClickRight", function(wrapped, ...args) {
      let result = Hooks.call(`clickRightToken`, this, args[0]);
      if(result === false)
         return false;
      else if(this.oldCan("ClickRight", args[0]))
         return wrapped(...args);
      else
         args[0].resumePropagation();
   }, "MIXED");
   
   libWrapper.register("token-character-artwork", "Token.prototype._onClickRight2", function(wrapped, ...args) {
      let result = Hooks.call(`clickRight2Token`, this, args[0]);
      if(result === false)
         return false;
      else if(this.oldCan("ClickRight2", args[0]))
         return wrapped(...args);
      else
         args[0].resumePropagation();
   }, "MIXED");
   
   Token.prototype.showArtwork = function()
   {
      let imagePopout = null;
      for(let i in ui.windows)
      {
         if(ui.windows[i].object === this.actor.data.img)
         {
            imagePopout = ui.windows[i];
            break;
         }
      }
      if(!imagePopout)
      {
         let title = "Character Artwork";
         if(this.data.displayName == CONST.TOKEN_DISPLAY_MODES.HOVER || this.data.displayName == CONST.TOKEN_DISPLAY_MODES.ALWAYS)
            title = this.data.name;
         else if(this.actor.permission != CONST.ENTITY_PERMISSIONS.NONE)
            title = this.actor.data.name;
         imagePopout = new ImagePopout(this.actor.data.img, {
            title: title,
            entity: {}
         });
      }
      imagePopout.render(true);
   };
   
   Hooks.on("clickLeftToken", (token, event) => {
      if(game.settings.get("token-character-artwork", "trigger") == 1 && event.data.originalEvent.shiftKey)
      {
         token.showArtwork();
         return false;
      }
      else if(game.settings.get("token-character-artwork", "trigger") == 5 && !token._canControl(game.user, event))
      {
         token.showArtwork();
         return false;
      }
      return true;
   });
   
   Hooks.on("clickRightToken", (token, event) => {
      if(game.settings.get("token-character-artwork", "trigger") == 2 && event.data.originalEvent.shiftKey)
      {
         token.showArtwork();
         return false;
      }
      else if(game.settings.get("token-character-artwork", "trigger") == 6 && !token._canHUD(game.user, event))
      {
         token.showArtwork();
         return false;
      }
      return true;
   });
   
   Hooks.on("clickLeft2Token", (token, event) => {
      if(game.settings.get("token-character-artwork", "trigger") == 3 && event.data.originalEvent.shiftKey)
      {
         token.showArtwork();
         return false;
      }
      else if(game.settings.get("token-character-artwork", "trigger") == 7 && !token._canView(game.user, event))
      {
         token.showArtwork();
         return false;
      }
      return true;
   });
   
   Hooks.on("clickRight2Token", (token, event) => {
      if(game.settings.get("token-character-artwork", "trigger") == 4 && event.data.originalEvent.shiftKey)
      {
         token.showArtwork();
         return false;
      }
      else if(game.settings.get("token-character-artwork", "trigger") == 8 && !token._canConfigure(game.user, event))
      {
         token.showArtwork();
         return false;
      }
      return true;
   });
});