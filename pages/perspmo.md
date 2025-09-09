---
layout: post
title: "How to use perspmo"
permalink: /posts/perspmo/
description: "Karaoke timing is the easiest part, so don't worry (for now)"
---

# Aegisub-Perspective-Motion

GitHub repository: <https://github.com/Zahuczky/Zahuczkys-Aegisub-Scripts>

Here you can find a complete tutorial on how to use Aegisub-Perspective-Motion properly.

You can download the script from the repository linked above, and install it by placing it in your `Aegisub/automation/autoload` folder. (Dependency Control coming soon [probably])

Huge thanks to [Alendt, for the original perspective `.moon` script](https://github.com/Alendt/Aegisub-Scripts), without that, this script wouldn’t have been possible!

Thanks to Medex, for creating this test video, for extensive testing of the script, and also being a good example for this tutorial!

Also, huge thanks to my Mom for occasional help with the math parts of the script. She is a Math/Physics/IT professor, and I’m just some dumbass Computer Science Engineer.

This script needs to be used *with* [Aegisub-Motion](https://github.com/TypesettingTools/Aegisub-Motion), so make sure you already have it.

**What you need before even starting tracking:**

- One line, with no clip, no `\fscx` or `\fscy` tags, positioned where you want it to be.
- A trimmed clip of your sign. (Aegisub-Motion -> Trim)  
  *(click on the images to see them in full size)*

![gw0lti](https://files.catbox.moe/gw0lti.png)

After that, you just track your sign with Mocha, as you always would, but make sure to turn **Perspective** on!

![4k7931](https://files.catbox.moe/4k7931.png)

Also make sure you display your **Planar Surface**, since the corners of this are what our perspective is going to be calculated from.

![8c9eop](https://files.catbox.moe/8c9eop.png)

It should look something like this at first (the blue rectangle with the cross in the middle):

![yxabmj](https://files.catbox.moe/yxabmj.png)

You need to make sure you set it to your perspective, even before starting to track!  
So align every corner of it with the corners of the plane you want to track.  
It should look something like this:

![qtqq6g](https://files.catbox.moe/qtqq6g.png)

If you’re not lucky enough to have your sign in the middle of your perspective plane, you’re probably gonna need to make 2 different tracks.  
For example, if you want your text to be there:

![cr4cca](https://files.catbox.moe/cr4cca.png)

You need to set up two different tracks, one for your position tracking with Aegisub-Motion, and one for your perspective.  
In the above case, your track for Aegisub-Motion should look something like this.  
For this, you don’t need to make sure to align your planar surface, but it’s always best practice.

![y1rfor](https://files.catbox.moe/y1rfor.png)

If you need to resort to this, make sure you export the **After Effects Transform Data** from your track for the position, and export your **After Effects POWER PIN Data** from the track for the perspective. (These things will make sense in a moment.)  
For the sake of this tutorial, we’re gonna go with the assumption that your sign is in the middle of your plane.

After that, just track your sign.  
Keep in mind that tracking perspective is usually trickier than just position/scale/rotation, so you might have to fiddle more with your **Input Channel / Min % Pixels Used / Search Area Horizontal, Vertical, Angle, Zoom**.

![omh1tw](https://files.catbox.moe/omh1tw.png)

If you did everything right, it should look something like this:  
*(Pay close attention to the blue planar surface, make sure it lines up perfectly with your plane)*

<video controls src="https://files.catbox.moe/fbol0v.mp4" style="max-width:100%; height:auto;">
  <a href="https://files.catbox.moe/fbol0v.mp4">Watch the video</a>
</video>

After you made sure your tracking is correct, export it as **After Effects Transform Data**, and paste it into Aegisub-Motion, while making sure **Scale** is **disabled!**

![c47j7r](https://files.catbox.moe/c47j7r.png)

![4tgnb8](https://files.catbox.moe/4tgnb8.png)

Rotation is also unnecessary.

After applying it, make sure it stays in roughly place during your track.

Now, go back into Mocha, and also export **After Effects POWER PIN Data**.  
No, not Corner Pin data, not CS3 corner pin data, not transform data, but **Power Pin data**!

![aqw7ar](https://files.catbox.moe/aqw7ar.png)

Now you can go back into Aegisub, and *finally* run **Aegisub-Perspective-Motion**.  
Paste your Power Pin data into the textbox, and hit apply.  
“Include `\clip` for debugging” puts a `\clip` on your line that represents the 4 points from which your perspective was calculated.  
Default behaviour is ON. (TODO: make it remember your setting)

![j8nu9f](https://files.catbox.moe/j8nu9f.png)

If you did everything correctly, **and also the stars aligned, and the Gods want it that way,** you should have a cool perspective-tracked sign, with no manual labour.

But sadly the stars usually don’t align, and the Gods don’t want it that way.  
The script is in BETA at the moment, so there are no guarantees it will work under every possible condition.

Here are a few examples where it worked:

<video controls src="https://files.catbox.moe/12klk7.mp4" style="max-width:100%; height:auto;">
  <a href="https://files.catbox.moe/12klk7.mp4">Watch the video</a>
</video>  
^ last frame wasn’t tracked, don’t mind it

<video controls src="https://files.catbox.moe/08iz69.mp4" style="max-width:100%; height:auto;">
  <a href="https://files.catbox.moe/08iz69.mp4">Watch the video</a>
</video>  
^ You can look at this as a short and undescriptive video tutorial

And here is an example where it didn’t work for every possible way:

<video controls src="https://files.catbox.moe/3ryjmx.mp4" style="max-width:100%; height:auto;">
  <a href="https://files.catbox.moe/3ryjmx.mp4">Watch the video</a>
</video>

That’s basically it.  
Contribution pull requests, ideas, feature requests, comments and issues are very welcome in the GitHub repo!  
Good typesetting.

– Zahuczky

