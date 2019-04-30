# Ceros Ski Code Challenge

Welcome to the Ceros Code Challenge - Ski Edition!

For this challenge, we have included some base code for Ceros Ski, our version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play our version here:
http://ceros-ski.herokuapp.com/

We understand that everyone has varying levels of free time, so take a look through the requirements below and let us
know when you will have something for us to look at (we also get to see how well you estimate and manage your time!).
Previous candidates have taken about 8 hours to complete our challenge. We feel this gives us a clear indicator of your
technical ability and a chance for you to show us how much you give a shit (one of Ceros's core values!) about the position
you're applying for. If anything is unclear, don't hesitate to reach out.

Requirements:
* The base game that we've sent you is not what we would consider production ready code. In fact, it's pretty far from
  it. As part of our development cycle, all code must go through a review. We would like you to perform a review
  on the base code and fix/refactor it. Is the codebase maintainable, unit-testable, and scalable? What design patterns
  could we use?

  **We will be judging you based upon how you update the code & architecture.**
* There is a bug in the game. Well, at least one bug that we know of. Use the following bug report to debug the code
  and fix it.
  * Steps to Reproduce:
    1. Load the game
    1. Crash into an obstacle
    1. Press the left arrow key
  * Expected Result: The skier gets up and is facing to the left
  * Actual Result: Giant blizzard occurs causing the screen to turn completely white (or maybe the game just crashes!)
* The game's a bit boring as it is. Add a new feature to the game to make it more enjoyable. We've included some ideas for
  you below (or you can come up with your own new feature!). You don't need to do all of them, just pick something to show
  us you can solve a problem on your own.
  * Implement jumps. The asset file for jumps is already included. All you gotta do is make the guy jump. We even included
      some jump trick assets if you wanted to get really fancy!
  * Add a score. How will you know that you're the best Ceros Skier if there's no score? Maybe store that score
      somewhere so that it is persisted across browser refreshes.
  * Feed the hungry Rhino. In the original Ski Free game, if you skied for too long, a yeti would chase you
      down and eat you. In Ceros Ski, we've provided assets for a Rhino to catch the skier.
* Update this README file with your comments about your work; what was done, what wasn't, features added & known bugs.
* Provide a way for us to view the completed code and run it, either locally or through a cloud provider
* Be original. Don’t copy someone else’s game implementation!

Bonus:
* Provide a way to reset the game once the game is over
* Provide a way to pause and resume the game
* Skier should get faster as the game progresses
* Deploy the game to a server so that we can play it without setting something up ourselves. We've included a
  package.json and web.js file that will enable this to run on Heroku. Feel free to use those or use your own code to
  deploy to a cloud service if you want.
* Write unit tests for your code

And don't think you have to stop there. If you're having fun with this and have the time, feel free to add anything else
you want and show us what you can do!

We are looking forward to see what you come up with!
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
This is a fun coding challenge where there are lots of skill sets involved with interesting features and leg room for additional creativity. I thoroughly enjoy the game as well as the features that could be expanded on this concept. It is also a great way to combine fun and programming to make the whole process entertaining. Here is the list of things I have done regarding Ceros ski challenge:

1. Fix the aforementioned bug that crashes the game when the user presses on the left arrow after a hit. This bug tackles the idea of making sure when decrementing the skierDirection parameter, one has to make sure it doesn't yield negative value. Since the skier image asset has an index at 0, there is no mapping for negative skiDirection.

2. Refactor the spaghetti coding practice where there is multiple switch case in different locations. I create a couple of hashmap tables to clean up this bad practice. Table lookup also ensures DRY code practice and improve performances. It is a fast and efficient way to retrieve items as well as preventing potential issues in the future (with share similarities with polymorphism). Additionally, I introduce 'this' keyword to preserve the object context in functions and params. Having private versus public methods, apply the 'bind' method in the gameLoop since 'this' context often get lost in callback functions. Reduce dependencies on lodash library by using native ES6 methods. Give params clear scope of being a constant or read-only.

3. Externalize game model into their own files by leveraging Typescript which is further explained in details below. The idea of having a separate model file that defines the interface for important objects can be very useful. This allows strict typings and making sure that certain properties are an option or compulsory depends on their usage.

4. Implement jump ramps and the logic to make the skier jumps the ramp when approaching one. I make sure the ramps are drawn in a similar fashion as obstacles and the interaction between the skier and jump-ramps will allow the user to jump over it. This comes with the help of all the jumping assets and I make sure to recalculate the position of the skier. When jumping through a ramp, the user would also score 5 points for each ramp that they make the jump successfully.

5. Add a high score button that utilizes local storage in order to calculate a game score. Add in logic to make sure if the skier is idle in the left or right direction then the score should not update. Initially, there is no score and it would update only when the skier starts traveling. This value in terms would be saved in the local storage and can be retrieved when clicking on the high score button.

6. Restructure the folders by adding abstraction layers where it would be separate the dev/staging codes with the production-ready ones. This action provides a good standard to follow and any build scripts given will benefit from this approach. Deploy this very coding project to a Heroku server where external parties can play around with.

7. Add in the reset button where if the user clicked on, it would bring the skier back to square one position as well as refresh the current score for a new playthrough. This reset button will not refresh the page and all the existing drawn obstacles remain in the same coordination. After the reset button is pressed, the current score is saved at the same time and the new score will be at 0.

8. Add in the ability to pause the game by pressing "K" keyboard shortcut. This would open a modal on top of the game where the user cannot control the skier and can only resume by pressing the same "K" shortcut. If the skier was in motion at the time of pressing pause, it would move the skier back to the original direction so that they would NOT lose their progress.

9. Deploy this very coding project to a Heroku server where external parties can play around with.

# New stuff I add on for this challenge

1. After learning that Ceros has future plans to migrate the source code base to Typescript, I have taken the plunge to refactor the game logic in Typescript. Benefiting from Typescript features then transforming them to Javascript really enhance the way the code structured. Private and public methods are quick to identify and global namespacing is no longer an issue.

2. Write the npm scripts which contributes to fast development. The compile script will concurrently run the local server, compile the Typescript codes into vanilla Javascript, transform the sass code into css and make sure all the files are watched. This means that if there are changes in the input files it would update automatically at the predefined output location.

3. Add the user prompts to ask for params like skier initial direction and skier speed. This is something that is benefiting from object creation which followed the prototype chain. Now they can change the direction and play the game in fast or slow mode. The prompts make sure to get valid inputs from the player before continuing. I like this approach because the developer can customize skier parameters to allow users to have more options in their gameplay.

4. Implement constructor function with Prototype Inheritance in mind. This plays well with the idea that players of the game can initialize their game with certain skier's speed and direction. By making sure all the newly created game object will be based on the same Class or Classes.

Overall, I believe the project can be enhanced even more if time permits. However, I am content with what I have achieved and I am looking forward to hearing any feedback or concerns if any.