[![Build Status](https://travis-ci.org/freddiefujiwara/state-machine-exec.svg?branch=master)](https://travis-ci.org/freddiefujiwara/state-machine-exec)
[![Build status](https://ci.appveyor.com/api/projects/status/a14pxw5roh4jecv2?svg=true)](https://ci.appveyor.com/project/freddiefujiwara/state-machine-exec)
[![CircleCI](https://circleci.com/gh/freddiefujiwara/state-machine-exec.svg?style=svg)](https://circleci.com/gh/freddiefujiwara/state-machine-exec)
[![npm version](https://badge.fury.io/js/state-machine-exec.svg)](https://badge.fury.io/js/state-machine-exec)
[![codecov](https://codecov.io/gh/freddiefujiwara/state-machine-exec/branch/master/graph/badge.svg)](https://codecov.io/gh/freddiefujiwara/state-machine-exec)
[![dependencies Status](https://david-dm.org/freddiefujiwara/state-machine-exec/status.svg)](https://david-dm.org/freddiefujiwara/state-machine-exec)

# state-machine-exec
Command line state machine executer 

## Requirements

 - Node 7.6 or later

## Installation

```bash
npm i -g state-machine-exec
```

*you need to prepare YOUR $HOME/.state-machine-exec.sm
## Usage
```bash                                                                                     
  Usage: state-machine-exec <decision> <args>                                                                                    
                                                                                                                         
                                                                                                                               
                                                                                                                               
  Options:                                                                                                                     
                                                                                                                               
    -V, --version     output the version number
    -h, --help        output usage information  
```

## Example
```bash
state-machine-exec test_start 1
SME>  google-home-speaker 192.168.1.999 テストスイート1を始めましょう。
SME>  
SME>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SME>  
SME>  
SME>  google-home-speaker 192.168.1.999 ではテストケースID:1、"qiitaトップページ"を始めます。前提条件 "ブラウザを立ち上げて、クッキーを削除する。"を準備してください。出来たら”テストOK”と言ってください。もう一度聞きたい場合は”テストもう一度”と言ってください。
```

## FAQ

[FAQ](https://github.com/freddiefujiwara/state-machine-exec/wiki/FAQ)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/freddiefujiwara/state-machine-exec
