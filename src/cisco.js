/*
Language: Cisco command line
Author: Branislav Mateáš <xmatea00@stud.fit.vutbr.cz>
Description: Based on CCNA course
Website: https://en.wikipedia.org/wiki/CCNA
*/

hljs.registerLanguage("cisco", function(hljs){
    /* regex for command */
    var command = /(?=^\s*[a-z0-9A-Z_]+(?:\(([a-zA-Z\-]*)\)#|#)|[a-zA-Z]+[0-9]\/[0-9]\z)/;
    /* regex for IPv4 address */
    var ip4 = /(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|9[0-9]|[1-8][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|9[0-9]|[1-8][0-9]|[0-9])(?:\/\d{1,2})?/;
    /* regex for IPv6 address, from: https://www.regextester.com/104187*/
    var ip6 = /(?![^\w:])(([0-9a-f]{1,4}:){1,7}:|:(:[0-9a-f]{1,4}){1,7}|([0-9a-f]{1,4}:){1,7}[0-9a-f]{0,4}(:[0-9a-f]{1,4}){1,7})(?![\w:])/;
    /* regex for MAC address in Cicso IOS notation */
    var mac =  /(?:[aA0-fF9]{4}\.){2}(?:[aA0-fF9]{4})/;
    return{
        name: 'cisco',
        case_insensitive: true,
        disableAutodetect: true,
        contains: 
        [
        {
          className: 'comment',
          variants: 
          [
            {
              begin:/^VLAN\s*Name/,
              end: command,
              returnBegin: true,
              contains:[{className: 'string', begin:/(?:Fa|Gig)\d\/\d+/},{className: 'number', begin:/\b\d+\b/},{className: 'keyword', begin: /(?<=^[0-9][0-9]?[0-9]?[0-9]?).+(?=\sactive|\d{6})/}] //este STATUS
            },
            {
              begin:/Cisco\sInternetwork/,
              end:/is\s[a-fA-F0-9]x[a-fA-F0-9]+/,
              contains: [{className: 'string', variants:[{begin:/"/, end:/"/}, {begin:/http/, end:/$/}]},{className: 'string', begin:/Processor\sboard/, end:/\(Read\/Write\)/, contains:[{className: 'number', begin:/^\d/, end:/(\s|K)/}]}]
            },
            {
                begin:/Interface\s+IP\-Address/,
                end: command,
                contains:[{className:'keyword', variants:[{begin: /^\w+((\d\/)+\d?|\d+)/},{begin:/(manual|DHCP|up)/}]},{className: 'number', begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/},{className: 'number', begin: /(?![^\w:])(([0-9a-f]{1,4}:){1,7}:|:(:[0-9a-f]{1,4}){1,7}|([0-9a-f]{1,4}:){1,7}[0-9a-f]{0,4}(:[0-9a-f]{1,4}){1,7})(?![\w:])/},{className:'string', begin: /(unset|unassigned|administratively\sdown|down)/},]
            },
            {
              begin: /Capability\sCodes/,
              end: command,
              contains:[{className: 'keyword', begin:/\s(\w|\*)(\d|\w?)\s(?=\-)/},{className:'comment', begin:/Port\sID/, end:/(?=^[a-zA-Z]+(\(([a-zA-Z\-]*)\)#|#)|[a-zA-Z]+[0-9]\/[0-9]\z)/, contains:[{className: 'keyword', variants:[{begin:/^[\w\.]+(?=\s)/}, {begin: /\b\w\b/}]}, {className: 'string', begin:/\s\w{1,3}\s[\d\/]+\d?/},{className:'number', begin: /\b\d+\b/}]}]
            },
            {
              begin:/(?<=show\sip\snat\stranslations)/,
              end: command,
              contains:[{className: 'number', begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/}, {className: 'keyword', begin:/(?<=\:)\d+(?=\s)/}, {className: 'string', begin:/(?<=^)\w+(?=\s)/}]
            },
            {
              begin:/(?<=show\sip\snat\sstatistics)/,
              end: command,
              contains:[{className: 'string', variants:[{begin:/(?<=pool\s)\w+(?=\srefCount)/},{begin:/(?<=Interfaces:\s).+(?=$)/}]},{className: 'number', variants:[{begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/},{begin:/\b\d+\b/}]}]
            },
            {
              begin:/(?<=show\sinterface\s[aA-zZ]+\s*\d+(\/\d+(\/\d+)?)?)/,
              end: command,
              contains:[{className: 'string', variants:[{begin:/\bup\b/},{begin:/Full\-duplex|Half\-duplex/i},{begin:/(?<=type\sis).+(?=$)/}]},{className: 'number', variants:[{begin:/\d+.b\/s/}, {begin:/(?:.{4}\.){2}(?:.{4})/}, {begin:/\b\d+\b/}]}]
            },
            {
              begin:/(?<=show\s(?:ip\s)?ssh)/,
              end: command,
              contains:[{className: 'string', begin:/(?<=Session\sStarted).+(?=$)/}, {className: 'number', variants:[{begin:/\b\d+\.\d+\b/}, {begin:/\b\d+\b/}]}]
            },
            {
              begin:/(?<=show\sip\sdhcp\sbinding)/,
              end: command,
              contains: [{className: 'number', begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/}, {className: 'string', begin: /(?:.{4}\.){2}(?:.{4})/}]
            },
            {
              begin: /(?<=show\sip\sdhcp\spool)/,
              end: command,
              contains: [{className: 'number', begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/}, {className: 'string', variants: [{begin: /\b\d+\b/}, {begin:/(?<=Pool).+(?=\:)/}]}]
            },
            {
              begin: /(?<=show\smac\saddress\-table)/,
              end: command,
              contains: [{className: 'string', begin:/(?<=\s)[\w\/]+\d(?=\s*$)/},{className: 'number', variants:[{begin:/(?:.{4}\.){2}(?:.{4})/},{begin:/\b\d+\b/}]}]
            },
            {
              begin: /(?<=show\sinterfaces\strunk)/,
              end: command,
              contains:[{className: 'string', begin:/(?<=\s*)[aA-zZ]+\d+(\/\d+(?:\/\d+)?)?/},{className: 'keyword', begin: /802\.1q/},{className: 'number', begin:/\b\d+\b/}]
            },
            {
              begin:/(?<=show\sinterfaces\s[aA-zZ]+\s*\d+(\/\d+(\/\d+)?)?\sswitchport)/, //--------------------------------------------------------------------------------------------TREBA PREROBIT NEJAK DYNAMICKY NA ROZNE INT 
              end:command,
              contains: [{className: 'string', begin:/(?<=(?:Name|Administrative\sMode|Operational\sMode|Access\sMode\sVLAN|Trunking\sNative\sMode\sVLAN)\:).+(?=$)/},{className: 'number', begin:/\b\d+\b/}]
            },
            {
              begin: /(?<=show\sport\-security)/,
              end: command,
              contains: [{className: 'string', variants:[{begin:/(?<=^)\s+[\w\/]+(?=\s)/}, {begin:/(?<=\d)\s+\w+(?=$)/}]},{className: 'number', begin:/\b\d+\b/}]
            },
            {
              begin: /(?<=show\sport\-security\sinterface\s[aA-zZ]+\s*\d+(\/\d+(\/\d+)?)?)/,
              end: command,
              contains:[{className: 'string', begin:/(?<=(?:Port\s(?:Security|Status)|Violation\sMode)\s+\:).+(?=$)/},{className: 'number', variants:[{begin:/(?:.{4}\.){2}(?:.{4})/},{begin: /\b\d+\b/}]}] // WARNING NON FIXED REGEX 
            },
            {
              begin: /(?<=show\sport\-security\saddress)/,
              end: command,
              contains: [{className: 'string', begin: /\b[aA-zZ]+\d\/\d(\/\d)?\b/},{className: 'number', variants: [{begin: /(?:.{4}\.){2}(?:.{4})/}, {begin: /\b\d+\b/}]}]
            },
            {
              begin: /(?<=show\sipv6\sinterface\sbrief)/,
              end: command,
              contains: [{className: 'keyword', variants:[{begin: /(?<=).+(?=\[)/}, {begin: /up/}]}, {className: 'string', begin: /unassigned|administratively\sdown|down/}, {className: 'number', begin: /(?![^\w:])(([0-9a-fA-F]{1,4}:){1,7}:|:(:[0-9a-fA-F]{1,4}){1,7}|([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{0,4}(:[0-9a-fA-F]{1,4}){1,7})(?![\w:])/}]
            },
            {
              begin: /(?<=show\sip(v6)?\sroute(\s\w+)?)/,
              end: command,
              contains:[{className: 'keyword', variants: [{begin:/^[aA-zZ]\s(?:[aA-zZ]+)?/},{begin:/\s(\w|\*)(\d|(\w\w?|\w?))\s(?=\-)/}]},{className: 'number', variants:[{begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{begin:/(?![^\w:])(([0-9a-fA-F]{1,4}:){1,7}:|:(:[0-9a-fA-F]{1,4}){1,7}|([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{0,4}(:[0-9a-fA-F]{1,4}){1,7})(?![\w:])(\/\d+)?/ }]},{className: 'string', variants:[{begin:/\b([aA-zZ]+\d\/\d(\/\d)?)|(Null|\w{5,})\d+\b/},{begin: /(?<=\[).+(?=\])/}]}]
            },
            {
              begin: /(?<=show\sipv6\sprotocols)/,
              end: command,
              contains: [{className: 'string', variants:[{begin:'"', end: '"'}, {begin: /\b(\w+\d\/\d(\/\d)?)|\w{4,}\d+\b/}]}]
            },
            {
              begin: /(?<=show\svtp\sstatus)/,
              end: command,
              contains:[{className: 'keyword', begin:/Server|Client|Transparent/},{className: 'number', variants:[{begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/}, {begin:/(?:[\daA-fF]{4}\.){2}(?:[\daA-fF]{4})/}, {begin: /\s\d+\s/}]}, {className:'string', begin:/(?<=VTP\sDomain\sName\s+:).+(?=$)/}]
            },
            {
              begin: /(?<=show\svtp\scounter)/,
              end: command,
              contains: [{className: 'number', begin: /\s\d+\s/}]
            },
            {
              begin: /(?<=show\svtp\spassword)/,
              end: command,
              contains: [{className: 'string', begin: /(?<=Password:\s)\w+(?=\s)/}]
            },
            {
              begin: /(?<=show\ssdm\sprefer)/,
              end: command,
              contains: [{className: 'string', begin: /(?<=")\w+(?=")/}, {className: 'number', variants:[{begin:/\b[\d\.]+K/}, {begin: /\b\d+\b/}]}]
            },
            {
              begin: /(?<=show\setherchannel\ssummary)/,
              end: command,
              contains:[{className: 'comment', begin: /\(LACP\sonly\)/},{className: 'keyword', variants:[{begin: /PAgP|LACP/},{begin: /(?<=\s).\s(?=-)/},{begin:/(?<=\().*?(?=\))/}]}, {className: 'string', begin: /(?<=\s)[\w\d\/]*?(?=\()/},{className: 'number', begin: /\s\d+\s/}]
            },
            {
              begin: /(?<=show\sstandby)/,
              end: command,
              contains:[{className: 'number', variants: [{begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{begin:/(?:[\daA-fF]{4}\.){2}(?:[\daA-fF]{4})/}]},{className:'string',variants:[{begin: /(?<=State\sis\s).+(?=$)/},{begin: /(?<=Group\sname\sis\s).+(?=\()/}] }]
            },
            {
              begin: /(?<=show\sstandby\sbrief)/,
              end: command,
              contains:[{className: 'number', variants:[{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{begin:/\s\d+\s/}]},{className:'string', begin:/[aA-zZ]{1,3}[\d\/]+/}]
            },
            {
              begin:/(?<=show\sspanning-tree\svlan\s\d+)/,
              end: command,
              contains:[{className: 'keyword', variants:[{begin:/^\s*[aA-zZ]{1,4}[\d\/]+\s/}]},{className: 'keyword', begin: /(?<=\.)\d+(?=\s)/},{className: 'number', variants:[{begin:/(?:[\daA-fF]{4}\.){2}(?:[\daA-fF]{4})/},{begin:/(?<=\s)\d+(?=\.)/},{begin:/\s\d+\s/}]}]
            },
            {
              begin: /(?<=show\sspanning-tree\sinterface\s.+\n)/,
              end: command,
              contains:[{className: 'string', begin:/VLAN\d{4}/}, {className: 'number', variants:[{begin:/(?<=\s)\d+(?=\.)/},{begin:/\s\d+\s/}]},{className: 'keyword', begin: /(?<=\.)\d+(?=\s)/}]
            },
            {
              begin: /(?<=show\sip\sprotocols)/,
              end: command,
              contains:[{className: "string", variants:[{begin:'"', end: '"'},{begin:/K\d=1/},{begin:/(?<=Redistributing\:).+(?=,)/}]},{className: 'number', variants:[{begin: /\s\d+\s/},{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/}]}]
            },
            {
              begin:/(?<=show\sip\seigrp\stopology)/,
              end: command,
              contains:[{className: 'string', begin: /(?<=via).+?(?=\(|,)/},{className: 'keyword', variants:[{begin: /(?<=\s).\s(?=-)/},{begin:/^\w\s/},{begin: /FD is \d+\s/}]},{className: 'number', variants:[{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/}]}]
            },
            {
              begin:/(?<=show\sip\sospf\sneighbors)/,
              end: command,
              contains:[{className: 'string', begin: /\s[aA-zZ]+[\d\/]+\s/},{className: 'number', begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{className: 'keyword', begin:/\s\w+\/\w+\s/}]
            },
            {
              begin:/(?<=show\sip\sospf\sinterface)/,
              end: command,
              contains:[{className: 'string', begin: /\s[aA-zZ]+[\d\/]+\s/}, {className: 'keyword', variants: [{begin:/\bup\b/},{begin:/(?<=Network\sType|State).+(?<=,)/}]},{className: 'number', variants:[{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/}]}] //{begin:/\s\d+\s/}
            },
            {
              begin:/(?<=show\sip\sospf\sborder\-routers)/,
              end: command,
              contains: [{className: 'keyword', variants:[{begin: /(?<=\s).\s(?=-)/},{begin:/^\w\s/},{begin: /Area\s\d+/}]},{className: 'number', begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{className: 'string', begin: /\b[aA-zZ]+[\d\/]+\b/}]
            },
            {
              begin:/(?<=show\sip\sospf\sdatabase)/,
              end: command,
              contains: [{className:'keyword', variants:[{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{begin:/Area\s\d+/}]},{className:'string', begin:/0[xX][\daA-fF]+/},{className: 'number', begin:/\s\d+\s/}]
            },
            {
              begin: /(?<=show\sip\scache\sflow)/,
              end: command,
              contains: [{className: 'number', variants: [{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/}, {begin: /\b\d+(\.\d+)?\b/}]}, {className: 'keyword', variants: [{begin: /\b[aA-zZ]+\d\/\d(\/\d)?(\.\d+)?\b/},{begin: /NULL|Local/}]}]
            },
            /*{
              begin: /(?<=show\sip\sflow\sexport)/,
              end: command,
              contains: [{className: 'number', begin: /\b\d+\b/}]
            },*/
            {
              begin: /(?<=show\sip\sinterface\s[aA-zZ]+\s*[\d\/]+)/,
              end: command,
              contains:[{className: 'number', variants:[{begin: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{begin: /\s\d+\s/}]},{className: 'string', variants: [{begin:/(?<=is\s)(?:up|down)/},{begin: '"', end: '"'}]},{className: 'keyword', begin: /MTU/}]
            },
            {
              begin: /(?<=show\ssnmp\scommunity)/,
              end: command,
              contains: [{className: 'string', begin: /(?<=:).+?(?=\s)/}]
            },
            {
              begin: /(?<=show\ssnmp)/,
              end: command,
              contains: [{className: 'number', begin: /\s\d+\s/}]
            },
            {
              begin: /(?<=show\sip\sbgp\ssummary)/,
              end: command,
              contains: [{className: 'keyword', begin:/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(\/\d+)?/},{className: 'number', begin: /\b\d+\b/}]
            },
            {
              begin: /(?<=show\saccess\-lists)/,
              end: command,
              contains: [{className: 'string', variants: [{begin:/any/},{begin:/(?<=access\slist|eq).+(?=$)/}]},{className: 'number', variants:[{begin: ip4},{begin: /\b\d+\b/}]},{className: 'keyword', begin:/(?<=(permit|deny)\s).+?(?=\s)/}]
            },
            {
              begin: /(Current configuration|Building configuration)/,
              end: /^end\s/,
              contains: [
                {className: 'string', begin: /^ntp/, end: /$/, contains: [{className: 'number', begin: ip4}]},
                {className: 'string', begin: /^ip\sflow/, end: /$/, contains: [{className: 'number', variants:[{begin: ip4},{begin: /\b\d+\b/}]}]},
                {className: 'string', begin: /^logging/, end:/$/, contains:[{className: 'keyword', begin: /(?<=trap).+(?=$)/},{className: 'number', begin: ip4}]},
                {className: 'string', begin: /^spanning\-tree/, end: /$/, contains: [{className: 'keyword', variants:[{begin:/(?<=mode|priority).+(?=$)/},{begin:/(?<=vlan).+(?=priority)/}]}]},
                {className: 'string', begin: /^ip\sdhcp\spool/, end: /!/, excludeEnd: true, contains: [{className: 'keyword', begin: /(?<=pool).+(?=$)/},{className: 'number', begin: ip4}]},
                {className: 'string', begin: /^ip\sdhcp\sex/, end: /$/, contains:[{className: 'number', begin: ip4}]},
                {className: 'string', begin: /^ip\snat/, end:/$/, contains:[{className: 'keyword', variants: [{begin: /(?<=list).+(?=pool|interface)/},{begin: /(?<=interface).+(?=overload)/},{begin:/(?<=pool\s).+?(?=\s)/}]},{className: 'number', begin: ip4}]},
                {className: 'string', begin: /^access-list/, end:/$/, contains: [{className: 'number', variants:[{begin: ip4},{begin: /\b\d+\b/}]}]},
                {className: 'string', begin: /^enable/, end: /$/, contains: [{className: 'keyword', begin:/(?<=secret|password).+(?=$)/}]},
                {className: 'string', begin: /^banner\smotd/, end: /$/, contains: [{className: 'keyword', begin: /(?<=motd).+(?=$)/}]},
                {className: 'string', begin:/^ip\sroute/, end: /$/, contains: [{className: 'number', begin: ip4}]},
                {className: 'string', begin:/^ip\slocal\spool/, end:/$/, contains: [{className: 'number', begin: ip4},{className: 'keyword', begin:/(?<=pool\s).+?(?=\s)/}]},
                {className: 'string', begin:/^line/, end: /!/, excludeEnd: true, contains: [{className: 'keyword', variants: [{begin:/(?<=line|input|password).+(?<=$)/}]},{className: 'number', begin: /\b\d+\b/}]},
                {className: 'string', begin: /^ipv6\srouter/, end: /$/, contains:[{className: 'keyword', begin:/(?<=router).+(?<=$)/}]},
                {className: 'string', begin: /^ipv6\sdhcp/, end: /!/, excludeEnd: true, contains: [{className: 'number', variants: [{begin: ip6},{begin:/\b\d+\b/}]},{className: 'keyword', begin: /(?<=(name|pool)).+(?<=$)/}]},
                {className: 'string', begin:/^ip\sdomain\sname/, end:/$/, contains:[{className: 'keyword', begin: /(?<=name).+(?=$)/}]},
                {className: 'string', begin: /^hostname/, end: /$/, contains:[{className: 'keyword', begin: /(?<=hostname).+(?=$)/}]},
                {className: 'string', begin:/^username/, end: /$/, contains: [{className:'keyword', variants:[{ begin: /(?<=username).+?(?=\s)/},{begin: /(?<=secret|password).+(?=$)/}]},{className: 'number', begin: /\b\d+\b/}]},
                {className: 'string', begin: /^(?:interface|bba\-group)/, end: /!/,excludeEnd: true, contains: [{className: 'keyword', variants: [{begin:/(?<=interface|server|duplex|speed|group|pool|chap\s(?:hostname|password)|encapsulation|description|ip\snat|switchport\smode).+(?<=$)/},{begin:/(?<=ipv6).+(?=enable)/}]},{className: 'number', variants:[{begin:/dhcp|negotiated/},{begin: mac},{begin: ip4},{begin: ip6},{begin:/\b\d+\b/}]}]},
                {className: 'string', begin:/^router/, end: /!/, excludeEnd: true, contains:[{className: 'keyword', begin: /(?<=router|passive\-interface|default\-information).+(?=$)/},{className: 'number', variants: [{begin: ip4},{begin: ip6},{begin: /\b\d+\b/}]}]}
              ]
            },
            {
              begin:/(?<=show\sppp\smultilink)/,
              end: command,
            contains:[{className: 'keyword', begin: /^\s*\w+(?=,)/}, {className: 'string', variants: [{begin: /(?<=(?:name|discriminator)\sis).+(?=$)/},{begin: /\b[aA-zZ]+\d+(\/\d+(\/\d+)?)?\b/}]},{className: 'number', variants:[{begin: /\b\d+x[\daA-fF]+/},{begin: /\b\d+/}]}]
            },
            {
              begin: /(?<=show\sip\slocal\spool)/,
              end: command,
            contains: [{className: 'keyword', begin: /(?<=^)\s*(?!Pool)\w+?(?=\s)/},{className: 'number', variants: [{begin: ip4},{begin: /\b\d+/}]}] 
            },
            {
              begin: /(?<=show\spppoe\ssession)/,
              end: command,
              contains: [{className: 'number', variants: [{begin: mac}, {begin: /\b\d+/}]},{className: 'string', begin: /\b[aA-zZ\-]+\d+(\/\d+(\/\d+)?)?\b/}]
            },
            {
              begin: /(?<=show\sntp\sstatus)/,
              end: command,
              contains: [{className: 'keyword', begin: ip4},{className: 'number', variants:[{begin: /\b\d+(\.\d+)?/}]}]
            },
            {
              begin: /(?<=show\sclock)/,
              end: command,
              contains: [{className: 'string', begin: /\b[aA-zZ]+\b/},{className: 'number', begin: /\b\d+/}]
            },
            {
              begin: /(?<=show\sntp\sassociations)/,
              end: command,
              contains: [{className: 'keyword', begin: ip4},{className: 'number', begin: /\b\d+(\.\d+)?/}]
            },
            {
              begin: /(?<=show\scontrollers(?:\s*[aA-zZ\-]+\d+(?:\/\d+(?:\/\d+)?)?)?)/,
              end: command,
              contains: [{className: 'number', variants: [{begin: /0(x|X)[0-9a-fA-F]+/},{begin: /\b[\da-fA-F]{4}\b/},{begin: /\b\d+(\.\d+)?/}]}]
            },
            {
              begin: /(?<=show\sip\sdhcp\sserver\sstatistics)/,
              end: command,
            contains: [{className: 'keyword', begin: /(?<=^\s*)(?!Message).+?(?=\d)/},{className: 'number', begin: /\b\d+/}]
            },
            {
              begin: /(?<=show\slogging)/,
              end: command,
              contains: [{className: 'number', begin: /\b\d+/},{className: 'keyword', begin: /\b[aA-zZ]+\slogging:/}]
            },
            {
              begin: /(?<=show\smonitor)/,
              end: command,
              contains: [{className: 'keyword', begin: /session\s+\d+/},{className: 'string', variants: [{begin: /\b[aA-zZ\-]+\d+(\/\d+(\/\d+)?)?\b/},{begin: /(?<=Type\s+:).+(?=$)/}]}]
            },
            {
              begin: /^\s*[a-zA-Z0-9_\-]+(?:\(([a-zA-Z0-9\-]*)\)#|(?:>|#))/,
              returnBegin:true,
              end: /$/,
              contains: 
              [
                {
                  className: 'keyword', 
                  begin: /#/, 
                  end: /$/, 
                  excludeBegin: true, 
                  contains: 
                  [
                    {
                      className: 'number', 
                      variants: 
                      [
                        {
                          begin: ip4
                        },
                        {
                          begin: ip6
                        },
                        {
                          begin: mac
                        },
                        {
                          className: 'string',
                          begin: /\b[aA-zZ\-]+\s*\d\/\d(\/\d)?\b/,
                        },
                        {
                          begin: /\b\d+/
                        },
                        {
                          className: 'string',
                          begin: /(?<=ipv6\srip).+?(?=\s)/
                        },
                        {
                          begin: /(?<=version\s)\d+(?=$)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=username\s+).+?(?=privilege|secret|password)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=(access\-group|traffic\-filter)).+(?=in|out)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=(secret|password|router|remark|passive\-interface|eq|range|key\-string|key\schain|#\s*name|description|hostname|standard|domain-name|dhcp\s(pool|server))\s+).*(?=$|\W)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=access-class\s+).+(?=in)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=ip(v6)?\saccess\-list\s).+(?=$)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=banner\smotd\s.).+(?=\s.\s)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=source\slist\s).+(?=interface|pool)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=digest\-key).+(?=md5)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=pool\s)[a-zA-Z\s]+(?=overload|\d)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=peer\sdefault\sip\saddress\spool).+(?=$)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=snmp\-server\s(location|contact)).+(?=$)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=snmp\-server\scommunity).+(?=ro)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=md5).+(?=$)/
                        },
                        {
                          className: 'string',
                          begin: /(?<=(permit|deny)\s).+?(?=\s)/
                        },
                        {
                          begin: /(prefix|clockrate|vty|privilege\slevel|maximum|vlan(\s(add|remove))?)\s/, 
                          end:/$/, 
                          excludeBegin: true
                        },
                      ]
                    }
                  ]
                }
              ]
            }
          ],
        },
      ],
    }
});
