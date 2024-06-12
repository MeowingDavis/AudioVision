---
title: Final Player Controller
publish_date: 2024-06-08
---


```C

using System;
using UnityEngine;

namespace UnityStandardAssets.Characters.FirstPerson
{
    [RequireComponent(typeof(Rigidbody))]
    [RequireComponent(typeof(CapsuleCollider))]
    public class RigidbodyFirstPersonController : MonoBehaviour
    {
        [Serializable]
        public class MovementSettings
        {
            public float ForwardSpeed = 8.0f;   // Speed when walking forward
            public float BackwardSpeed = 4.0f;  // Speed when walking backwards
            public float StrafeSpeed = 4.0f;    // Speed when walking sideways
            public float SpeedInAir = 8.0f;     // Speed when in air
            public float RunMultiplier = 2.0f;   // Speed multiplier when running
            public float JumpForce = 30f;

            [HideInInspector] public float CurrentTargetSpeed = 8f;

            public void UpdateDesiredTargetSpeed(Vector2 input, bool isRunning)
            {
                if (input == Vector2.zero) return;
                if (input.x > 0 || input.x < 0)
                {
                    // Strafe
                    CurrentTargetSpeed = StrafeSpeed * (isRunning ? RunMultiplier : 1.0f);
                }
                if (input.y < 0)
                {
                    // Backwards
                    CurrentTargetSpeed = BackwardSpeed * (isRunning ? RunMultiplier : 1.0f);
                }
                if (input.y > 0)
                {
                    // Forwards
                    // Handled last as if strafing and moving forward at the same time, forwards speed should take precedence
                    CurrentTargetSpeed = ForwardSpeed * (isRunning ? RunMultiplier : 1.0f);
                }
            }
        }

        public bool canrotate;
        public Camera cam;
        public MovementSettings movementSettings = new MovementSettings();
        public MouseLook mouseLook = new MouseLook();
        public Vector3 relativevelocity;

        public DetectObs detectGround;

        public bool Wallrunning;

        public float runningSwayAmount = 2.0f; // Adjust the amount of sway when running
        public float bobbingSpeed = 1.0f; // Adjust the speed of bobbing
        public float bobbingAmount = 0.5f; // Adjust the amount of bobbing
        public float fovTransitionSpeed = 5.0f; // Adjust the speed of FOV transition

        private Vector3 originalCameraPosition;
        private Rigidbody m_RigidBody;
        private CapsuleCollider m_Capsule;
        private bool m_IsGrounded;
        private bool m_IsRunning; // Flag to indicate whether the player is running
        private bool isMoving; // Flag to indicate whether the player is moving

        private float timer = 0.0f;

        public float walkingFOV = 60f; // Default walking FOV
        public float runningFOV = 70f; // FOV when running

    

        public bool isPaused = false;
        public Vector3 Velocity
        {
            get { return m_RigidBody.velocity; }
        }

        public bool Grounded
        {
            get { return m_IsGrounded; }
        }

        private void Awake()
        {
            canrotate = true;
            m_RigidBody = GetComponent<Rigidbody>();
            m_Capsule = GetComponent<CapsuleCollider>();
            mouseLook.Init(transform, cam.transform);
            originalCameraPosition = cam.transform.localPosition;

            // Lock the cursor and hide it at the start of the game
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }

        private void Update()
        {
            if (!isPaused)
            {
                relativevelocity = transform.InverseTransformDirection(m_RigidBody.velocity);
                if (m_IsGrounded)
                {
                    if (Input.GetKeyDown(KeyCode.Space))
                    {
                        NormalJump();
                        AudioManager.Instance.PlaySFX("Jump");
                    }
                }

                // Check if left Shift key is pressed down to toggle running
                if (Input.GetKeyDown(KeyCode.LeftShift))
                {
                    m_IsRunning = true;
                    
                }
                else if (Input.GetKeyUp(KeyCode.LeftShift))
                {
                    m_IsRunning = false;
                }

                // Check if the player is moving
                isMoving = Input.GetAxisRaw("Horizontal") != 0 || Input.GetAxisRaw("Vertical") != 0;
            }
        }
        private void LateUpdate()
        {
            if (canrotate)
            {
                RotateView();
            }
            else
            {
                mouseLook.LookOveride(transform, cam.transform);
            }
        }

        private void FixedUpdate()
        {
            if (!isPaused)
            {
                GroundCheck();
                Vector2 input = GetInput();

                float h = input.x;
                float v = input.y;
                Vector3 inputVector = new Vector3(h, 0, v);
                inputVector = Vector3.ClampMagnitude(inputVector, 1);

                // Grounded
                if ((Mathf.Abs(input.x) > float.Epsilon || Mathf.Abs(input.y) > float.Epsilon) && m_IsGrounded && !Wallrunning)
                {
                    movementSettings.UpdateDesiredTargetSpeed(input, m_IsRunning);
                    m_RigidBody.AddRelativeForce(inputVector * Time.deltaTime * 1000f * movementSettings.CurrentTargetSpeed);
                }
                // In air
                else if ((Mathf.Abs(input.x) > float.Epsilon || Mathf.Abs(input.y) > float.Epsilon) && !m_IsGrounded && !Wallrunning)
                {
                    movementSettings.UpdateDesiredTargetSpeed(input, m_IsRunning);
                    m_RigidBody.AddRelativeForce(inputVector * Time.deltaTime * 1000f * movementSettings.SpeedInAir * movementSettings.CurrentTargetSpeed);
                }
            }
        }

        public void NormalJump()
        {
            m_RigidBody.velocity = new Vector3(m_RigidBody.velocity.x, 0f, m_RigidBody.velocity.z);
            m_RigidBody.AddForce(new Vector3(0f, movementSettings.JumpForce, 0f), ForceMode.Impulse);
        }

        private Vector2 GetInput()
        {
            Vector2 input = new Vector2
            {
                x = Input.GetAxisRaw("Horizontal"),
                y = Input.GetAxisRaw("Vertical")
            };
            return input;
        }

        private void RotateView()
        {
            // Avoids the mouse looking if the game is effectively paused
            if (Mathf.Abs(Time.timeScale) < float.Epsilon) return;

            // Lock the cursor and hide it during gameplay
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;

            mouseLook.LookRotation(transform, cam.transform);

            // Calculate sway based on movement speed
            float swayAmount = isMoving && m_IsRunning ? runningSwayAmount : 0f;

            float swayX = Input.GetAxis("Horizontal") * swayAmount * Time.deltaTime;
            float swayY = Mathf.Sin(timer) * bobbingAmount;

            // Increment timer based on bobbing speed
            timer += bobbingSpeed * Time.deltaTime;
            if (timer > Mathf.PI * 2)
            {
                timer = timer - (Mathf.PI * 2);
            }

            // Apply sway and bobbing
            Vector3 sway = new Vector3(swayX, swayY, 0f);
            cam.transform.localPosition = originalCameraPosition + sway;

            // Smoothly transition FOV
            float targetFOV = m_IsRunning && isMoving ? runningFOV : walkingFOV;
            cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, targetFOV, fovTransitionSpeed * Time.deltaTime);
        }
        // Add these fields to your class

        private void GroundCheck()
        {
            if (detectGround.Obstruction)
            {
                m_IsGrounded = true;
            }
            else
            {
                m_IsGrounded = false;
            }
        }
    }
}

```