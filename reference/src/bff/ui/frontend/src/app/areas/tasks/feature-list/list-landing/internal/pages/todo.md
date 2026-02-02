# Plan

We actually have two types of tasks:

## Session Log

While using the application, you can record tasks. 

These are saved locally.

They must have:
- a local generated id
- a start time
- an end time
- be at least X minutes long (we'll skip this, but...)

They may have:
- a description
- notes

## Official Log

These are the tasks retrieved from the server.

They must have:
- A server generated id.
- A a description

They may have:
- notes

## Display

These should all be displayed on the list.

Session tasks should be indicated in some way.

You can:

- edit description of local tasks
- edit notes of local tasks and official tasks
- save local task to official tasks (keep)
- abandon local tasks


## Future Features

- Can continue a task
    - Restart the timer on a task.
    - Maybe only local tasks
