#!/bin/bash
PID=$(pgrep gulp)
kill $PID
PID=$(pgrep electron)
kill $PID