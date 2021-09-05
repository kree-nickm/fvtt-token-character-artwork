# Token Character Artwork
Allows anyone to see an actor's artwork when they interact with its token. Each user can select their preferred hotkey, though currently it must be some combination of shift, left click, and right click.

## Installation
In the Foundry VTT module manager, click the Install Module button and paste this URL into the Manifest URL box, then click Install: `https://raw.githubusercontent.com/kree-nickm/fvtt-token-character-artwork/main/module.json`

You also need to install the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) module, but that should happen automatically when you do the above.

## Compatibility
Utilizing libWrapper should minimize conflicts, however, this module changes the way Foundry handles all mouse clicks involving tokens. So, if Foundry decides to make its own changes to mouse clicks, this module will almost certainly mess that up. But hopefully any change they make will be rewriting the mouse interaction manager to function the way that I did, because it has to be this way for modules to make any use of it.

I may eventually separate out my mouse interaction changes into a utility module that can be used by any other module, but for now this is it.
