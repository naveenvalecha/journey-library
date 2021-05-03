# journey-library
A ReactJS library for use with the Drupal Journey module.

## Configuration

No configuration required if used with the Drupal Journey module

### Structure

The entry point is App.jsx it holds all the info about the journey.

States to keep an eye on: this.state.product & this.state.products

It also holds the steps(this.state.steps)

 - SidePanel:         Shows your selections.
 - Panel:     Lists the querys and options for selection.
    -HandleBar:     List the option.
    -HandleBarBody: List the options.
        -InputField:    Provide custom input.

### Components

- index.jsx
  - App.jsx
    - Components/
      -SidePanel: List out the all the selected options during the journey.
      -Panel:   Provide the query and options for that query where you can select your option and complete  you journey. And provide the back, forword and reset options.
        -HandleBar: Provide the list of options.
        -HandleBarBody: Provide the query.
            -InputField:    Provide the custom input option. 