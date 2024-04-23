---
title: Trigger Animation on level load.
publish_date: 2024-04-23
---
This script serves the purpose of smoothly transitioning between scenes in a game by triggering an animation before loading the next scene. It achieves this by utilizing a coroutine, which introduces a delay allowing the animation to play out before the scene switch occurs.

The core mechanism involves calling a public method called LoadNextScene(), which initiates the scene switch process. Inside this method, a coroutine named DelaySceneSwitch() is started.

Within the coroutine, if an animator reference is provided, it triggers the designated animation. Then, it waits for a specified delay time before loading the next scene. This delay ensures that the animation has sufficient time to complete before the transition.

<br>

```c#
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections;

public class SceneSwitcher : MonoBehaviour
{
    public float delayTime = 1f; // Delay time before switching scene
    public Animator animator; // Reference to the animator with the animation to play

    public void LoadNextScene()
    {
        // Start the coroutine to delay the scene switch
        StartCoroutine(DelaySceneSwitch());
    }

    IEnumerator DelaySceneSwitch()
    {
        // Play the animation
        if (animator != null)
        {
            animator.SetTrigger("Start");
        }

        // Wait for the specified delay time
        yield return new WaitForSeconds(delayTime);

        // Load the next scene
        int currentSceneIndex = SceneManager.GetActiveScene().buildIndex;
        SceneManager.LoadScene(currentSceneIndex + 1);
    }
}
