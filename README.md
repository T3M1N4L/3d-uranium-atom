# 3D Uranium Atom - yet another highseas submission
> This was very fun to make, althoguh there were a few frustrating moments.

A 3D representation of a uranium atom using Three.js. This project visualizes the structure of a uranium atom, including protons, neutrons, and electrons, with custom-calculated electron clouds based on the known atomic structure.

## Why?

This project was created to visually demonstrate the structure of a uranium atom, providing an interactive experience of atomic particles and electron orbits. It can be useful for educational purposes, especially for those looking to better understand atomic structure and atomic theory in a more engaging, 3D visual format.

The model includes:
- A 3D visualization of the nucleus, with protons and neutrons positioned.
- Electron cloud simulations with different orbital shells.
- Interaction capabilities that allow you to rotate the view of the atom.
- Sidebar with details about uranium’s atomic structure and properties.

## Features

- **3D Atomic Model:** A detailed 3D model representing a uranium atom, including protons, neutrons, and electron clouds.
- **Electron Clouds:** Custom-calculated positions for the electron clouds, with varying orbital shells.
- **Interactive:** Users can rotate the 3D model to explore the atomic structure from different angles.
- **Sidebar Information:** Click on a question mark in the top right corner to open a sidebar with information about uranium, its electrons, protons, and neutrons, and how the model was calculated.
- **Smooth Transitions:** The sidebar opens and closes with a smooth transition when clicking the question mark.

## Customization

You can easily modify the atom displayed by editing the JSON variables in the code. To change the atom, locate the `atomicBlueprint` object in the code, which contains the following properties:

```JS
const atomicBlueprint = {
    protons: 92,   // Number of protons (e.g., Uranium)
    neutrons: 146, // Number of neutrons
    electrons: 92  // Number of electrons (for a neutral atom, this equals the number of protons)
};
```
Simply change the values of `protons`, `neutrons`, and `electrons` to represent the desired atom. For example, to create a carbon atom, you would set:

```JS

const atomicBlueprint = {
    protons: 6,
    neutrons: 6,
    electrons: 6
};

```

## Technologies Used

- **Three.js:** A 3D JavaScript library used to render the uranium atom.
- **HTML/CSS:** For structuring the webpage and styling the 3D model and sidebar.
- **JavaScript:** For functionality such as creating the atom model, handling user interactions, and opening/closing the sidebar.

