Feature: Verify that the user is able to add a macro (without marcro name)

  Scenario Outline: Add a macro with trigger, action, constraint, and local varialbe

    Given I open the app on homeTab
    When I click on the "Add Macro" tile
    And I add macro components
    | TYPE       | CATEGORY          | ITEM                      | OPTIONS                              |
    | trigger    | Applications      | App Install/Remove/Update | Application Removed, Any Application |
    | action     | <ACTION CATEGORY> | <ACTION ITEM>             | <ACTION OPTION>                      |
    | constraint | Device State      | Airplane Mode             | Airplane Mode Disabled               |
    And I add local variables
    | NAME            | TYPE            | VALUE       |
    | <VARIABLE NAME> | <VARIABLE TYPE> | <VALUE>     |
    Then the macro includes
    | TYPE       | NAME                   | DETAILS         |
    | trigger    | Application Removed    | Any Application |
    | action     | <DISPLAY NAME>         | <DETAILS>       |
    | constraint | Airplane Mode Disabled |                 |
    | variable   | <VARIABLE NAME>        | <VALUE>         |

    Examples:
      | ACTION CATEGORY | ACTION ITEM      | ACTION OPTION | DISPLAY NAME     | DETAILS       | VARIABLE NAME | VARIABLE TYPE | VALUE |
      #| Logging         | Clear Log        | System Log    | Clear Log        | System Log    | Test Case     | Integer       | 1     |
      #| Date/Time       | Say Current Time | 24 Hour       | Say Current Time | 24 hour clock | Test variable | Boolean       | true  |
      #| Device Actions  | Fill Clipboard   | Hello world   | Fill Clipboard   | Hello world   | Test string   | String        | abc12 |
      # The following example will fail from 2 errors, which will prove that soft assert is working
      | Device Actions  | Fill Clipboard   | Hello world   | Fill             | Hello world   | Test string   | Integer       | 0001  |
