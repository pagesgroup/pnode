(async function () {
    console.log('HMI 1.0');
    const {
        api,
        setValue,
        setNameValue,
        mqttClient,
        uid,
        items,
        cmdb,
        url,
        lang,
        swtags,
        main,
        control,
        info,
        sbs,
        data,
        omstellijst,
        pmnr,
    } = await pmCtrl.init();
    const { pathname, host, protocol, searchParams } = url;
    let prod = localStorage.getItem("prod");
    // console.log({ sbs, cmdb, uid, items });
    const ioList = [];
    // (function createItems(rows, item, path = []) {
    //     (rows || []).forEach(row => {
    //         row.path = path;
    //         row.swpath = path;
    //         if (row.name) {
    //             row.fullname = row.path.concat(row.name).join('.');
    //             // row.mqqtname = row.path.concat(row.name).join('/')
    //             item[row.name] = row;
    //             [
    //                 row.em,
    //                 row.cm,
    //                 row.alarm,
    //                 row.parameters,
    //                 row.input,
    //                 row.output,
    //                 row.command,
    //             ].forEach(rows => createItems(rows, row, path.concat(row.name)))
    //         }
    //     })
    // })(cmdb.unit, items)

    // console.log({ items });
    function demo() {
        const { ioList, products } = cmdb
        $(document.body).clear().style('height:100%;overflow:auto;').append(
            $('h1').text(cmdb.model),
            $('h1').text('Producten'),
            products.map(row => [
                $('h2').text(row.name),
                $('pre').text(JSON.stringify(row, null, 2)),
            ]),
            $('h1').text('IO List'),
            ioList.map(r => r.module).unique().map(module => [
                $('h2').text(module),
                $('ul').class('iolist').append(
                    ioList.filter(r => r.module === module).map(row => $('li').text(row.ioSw, row.descr_nl).append(

                    ))
                )
            ]),

            // $('pre').text(JSON.stringify(cmdb, null, 2)).style('height:500px;overflow:auto;'),
        )
    }
    const modules = ioList.map(row => row.module).unique().map(name => Object({
        name,
        io: ioList.filter(r => r.module === name).map(row => Object.assign(row, {
            name: [
                row.module,
                row.symbol,
                row.symbolTekst,
                row.system,
                row.equipment,
                row.object,
                row.status,
                row.locatie1,
                row.locatie2,
                row.extra1,
                row.extra2,
                row.channel,
                row.color,
                row.valve,
                row.cylinder,
                row.relais,
                row.function,
                row.input,
                row.remark1,
                row.remark2,
            ].join(' ').camelCase(),
        })),
    }))
    mqttClient.onMessageArrived = function (message) {
        const { destinationName, payloadString } = message;
        const parts = destinationName.split('/');
        parts.shift();
        const swtag = parts.join('.');
        // const name = parts.join('/');
        // console.log(swtag);
        console.log('<', swtag, payloadString);
        let node = swtags[swtag];
        node.value = JSON.parse(payloadString);
        // for (let i = 0; i < parts.length - 1; i++) {
        //     node = node[parts[i]] ??= {};
        // }
        // const key = parts.at(-1);
        if (node) {
            // console.log({ node })
            document.querySelectorAll(`[name="${swtag}"]`).forEach(e => {
                // console.log(e, e.type, e.checked, e.value, e.hasAttribute('checked'));
                if (e.type === 'checkbox') {
                    e.checked = Number(node.value) === 1;
                } else {
                    $(e).value(node.value);
                }
            });
            return;

            node.alarm = node.alarm || [];
            if (node[key]) {
                try {
                    node[key].value = JSON.parse(payloadString);
                } catch {
                    node[key].value = payloadString;
                }

                if (name == 'base/machine/hmi1/di_pb_start_1') {
                    if (node[key].value) {
                        $(document.body).attr('status', 'running');
                        $('.signal').attr('green', 1);
                    }
                }
                const name1 = node[key].fullname;
                // console.log('name',name1);
                document.querySelectorAll(`[name="${name1}"]`).forEach(e => {
                    // console.log(e, e.type, e.checked, e.value, e.hasAttribute('checked'));
                    if (e.type === 'checkbox') {
                        e.checked = Number((node[key] || {}).value) === 1;
                    } else {
                        $(e).value((node[key] || {}).value);
                    }
                });
                if (node.alarm.includes(node[key])) {
                    if (node[key].value) {
                        node[key].start = new Date();
                    }
                    if (!node[key].elErr) {
                        node[key].elErr = $('div').parent('.footer').append(
                            $('div').class('descr').text(node[key].hmi),
                        ).on('click', e => {
                            if (!node[key].value) {
                                node[key].elErr.remove();
                                node[key].elErr = null;
                                node[key].value = null;
                            }
                            if (node.elemObj) {
                                if (!node.alarm.some(row => row.value != null)) {
                                    node.elemObj.attr('active', null);
                                }
                            }
                        });
                        node[key].elStart = $('div').class('time').parent(node[key].elErr);
                        node[key].elStart.text(node[key].start.toLocaleString());
                    }

                    node[key].elErr.attr('active', node[key].value);
                    if (node.elemObj) {
                        node.elemObj.attr('active', node.alarm.some(row => row.value) ? 1 : 0);
                    }
                    if (node[key].type === 3) {
                        $('.signal').attr('red', node[key].value ? 2 : 1);
                    }
                }
            }
        }
    }
    // console.log({ url, cmdb });
    function getTimestamp() {
        return new Date().toISOString().replace(/-|\:/g, '').substring(0, 15);
    }
    function get(item) {
        return item.value || null;
    }
    function set(item, value = 0) {
        console.log(item.swpath, value);
        item.value = setNameValue(item.swpath, value)
    }
    function every(...args) {
        return args.every(Boolean);
    }
    (function plc() {
        return;
        // console.log('plc', get(items.base.doors.left.si_door_left_front_1), get(items.base.doors.err_door_open_left_front));
        if (every(get(items.base.doors.left.si_door_left_front_1), get(items.base.doors.left.si_door_left_front_2))) {
            if (get(items.base.doors.err_door_open_left_front)) {
                set(items.base.doors.err_door_open_left_front, 0);
            }
        } else {
            if (!get(items.base.doors.err_door_open_left_front)) {
                set(items.base.doors.err_door_open_left_front, 1);
            }
        }
        // console.log(items.base.doors.left.si_door_left_front_1)
        setTimeout(plc, 3000);
    })()
    const hmistate = JSON.parse(localStorage.getItem('hmistate') || '{}');
    function toggle(e) {
        // console.log(e);
        hmistate[e.target.id] = e.newState;
        localStorage.setItem('hmistate', JSON.stringify(hmistate));
    }
    let elemId = 0;
    function label(row) {
        return row['f' + lang] || row[lang] || row.en || row.nl || row.hmi || row.name || row.fkey;
    }



    const hmi = {
        data: {},
        values: {},
        menubuttons(menu) {
            return Object.entries(menu).map(([key, fn]) => $('button').class(key).on('click', fn))
        },
        sbs(obj, items, level = 1, icn, path = []) {
            // console.log({ obj })
            if (!obj || typeof obj !== 'object') return;
            // return Object.values(obj).map(obj => {
            const { fkey } = obj;
            // console.log(fkey, obj);
            const item = items[obj.name] = items[obj.name] || {};
            if (obj.loc) {
                // console.log(obj.loc);
                item.elemObj = $('i').parent('div.image');
            }
            return $('details').id(fkey).open(hmistate[fkey] == 'open').on('toggle', toggle).append(
                $('summary').append(
                    icn,
                    $('span').text(obj.tag),
                    $('label').text(label(obj)),
                ),
                [
                    'Parameter',
                    'Command',
                    'Status',
                    'Alarm',
                    'Input',
                    'Output',
                ]
                    .filter(group => obj[group.toLowerCase()])
                    .map(group => $('details').id(obj.fkey + group).open(hmistate[obj.fkey + group] == 'open').on('toggle', toggle).append(
                        $('summary')
                            .text(icons[group.toLowerCase()], group),
                        Object
                            .values(obj[group.toLowerCase()])
                            .filter(row => row && typeof row === 'object')
                            .map(row => $('div')
                                .class('btn-' + group.toLowerCase())
                                .append(
                                    (function prop() {
                                        // console.log(row.swpath)
                                        // row.full_name = (row.path || []).concat(row.name).join('.');//path.concat(obj.name, name(row)).join('/');
                                        if (group === 'Parameter') {
                                            return $('input')
                                                .name(row.swpath)
                                                .type('number')
                                                .step(1)
                                                // .value(item[row.name])
                                                .on('change', e => set(row, e.target.value))
                                        }
                                        return $('input')
                                            .name(row.fswtag)
                                            .id(row.id = row.fswtag)//(row.swpath||''))//.replace(/\./g, '/'))
                                            .checked(Number(item[row.name] = item[row.name] || row.value) == 1)
                                            .type('checkbox')
                                            .on('change', e => {
                                                // console.log(row.fswtag, row);
                                                setNameValue(row.fswtag, e.target.checked ? 1 : 0)
                                                // set(row, e.target.checked ? 1 : 0)
                                            });
                                    })(),
                                    $('label')
                                        .style(!row.iotag ? 'opacity:0.3;' : null)
                                        .attr('io', row.di || row.do || row.sdi || row.sdo || row.ai || row.ao)
                                        .append(
                                            $('span').text(row.tag || row.comp),
                                            // $('span').text(row.tag),
                                            $('label').text(label(row)),
                                            $('small').text(row.iotag),
                                            // $('small').text((row.path || []).filter(r => r.tag).concat({ tag: row.i }).map(r => r.tag).join('-')),
                                        )
                                        // .text(row.hmi || row.nl || row.name, row.unit ? `(${row.unit})` : null)
                                        .title(row.description)
                                        .for(row.id),
                                ),
                            ),
                    )),
                Object.values(obj.em ??= {}).map(obj => hmi.sbs(obj, item, level + 1, icons.em, path.concat(obj.name))),
                Object.values(obj.cm ??= {}).map(obj => hmi.sbs(obj, item, level + 1, icons.cm, path.concat(obj.name))),
                // hmi.sbs(obj.cm, item, level + 1, icons.cm, path.concat(obj.name)),
            )
            // })
        },
        sbs1(rows, items, level = 1, icn, path = []) {
            return (rows || []).filter(Boolean).map(obj => {
                name(obj);
                const item = items[obj.name] = items[obj.name] || {};
                const full_name = obj.full_name = path.concat(obj.name).join('/');
                if (obj.loc) {
                    // console.log(obj.loc);
                    item.elemObj = $('i').parent('div.image');
                }
                return $('details').id(full_name).open(hmistate[full_name] == 'open').on('toggle', toggle).append(
                    $('summary').append(
                        icn,
                        $('span').text(obj.tag),
                        $('label').text(obj[lang] || obj.hmi || obj.name),
                    ),
                    [
                        'Parameter',
                        'Command',
                        'Status',
                        'Alarm',
                        'Input',
                        'Output',
                    ].map(group => obj[group.toLowerCase()] ? $('details').id(full_name + group).open(hmistate[full_name + group] == 'open').on('toggle', toggle).append(
                        $('summary').text(icons[group.toLowerCase()], group),
                        obj[group.toLowerCase()].map(row => $('div')
                            .class('btn-' + group.toLowerCase())
                            .append(
                                (function prop() {
                                    // console.log(row.swpath)
                                    // row.full_name = (row.path || []).concat(row.name).join('.');//path.concat(obj.name, name(row)).join('/');
                                    if (group === 'Parameter') {
                                        return $('input')
                                            .name(row.swpath)
                                            .type('number')
                                            .step(1)
                                            // .value(item[row.name])
                                            .on('change', e => set(row, e.target.value))
                                    }
                                    return $('input')
                                        .name(row.swpath)
                                        .id(row.id = row.swpath)//(row.swpath||''))//.replace(/\./g, '/'))
                                        .checked(Number(item[row.name] = item[row.name] || row.value) == 1)
                                        .type('checkbox')
                                        .on('change', e => {
                                            // console.log(row.swpath, row);
                                            set(row, e.target.checked ? 1 : 0)
                                        });
                                })(),
                                $('label')
                                    .attr('io', row.di || row.do || row.sdi || row.sdo || row.ai || row.ao)
                                    .append(
                                        $('span').text(row.tag || row.comp),
                                        // $('span').text(row.tag),
                                        $('label').text(row[lang] || row.en || row.nl || row.hmi || row.name),
                                        $('small').text(row.iotag),
                                        // $('small').text((row.path || []).filter(r => r.tag).concat({ tag: row.i }).map(r => r.tag).join('-')),
                                    )
                                    // .text(row.hmi || row.nl || row.name, row.unit ? `(${row.unit})` : null)
                                    .title(row.description)
                                    .for(row.id),
                            ),
                        ),
                    ) : null),
                    hmi.sbs(obj.em, item, level + 1, icons.em, path.concat(obj.name)),
                    hmi.sbs(obj.cm, item, level + 1, icons.cm, path.concat(obj.name)),
                )
            })
        },
        topmenu: {
            home() {
                const { values } = this;
                // console.log(data);
                function input(key, prop) {
                    const name = [prop.system, prop.equipment, prop.title].filter(Boolean).join(' ').toCamelCase();
                    const value = values[name] || prop.default;
                    if (prop.options) {
                        const attr = {};
                        return $('select')
                            .class('form-element')
                            .name(name)
                            .append(
                                prop.options.split('|').map((cap, i) => $('option')
                                    .text(cap).value(i).selected(i == value))
                            )

                    }
                    return $('input')
                        .class('form-element')
                        .value(value)
                        .name(name)
                        .type(prop.type)
                        .step(prop.step)
                        // .type('text')
                        .placeholder(prop.type)
                        .inputmode(prop.inputmode)
                        .pattern(prop.pattern)
                        .min(prop.min)
                        .max(prop.max)
                        .readonly(prop.readOnly)
                }
                function propdiv(key, prop) {
                    const name = [prop.system, prop.equipment, prop.title].filter(Boolean).join(' ').toCamelCase();
                    const value = values[name] || prop.default;
                    // console.log(name,value)
                    if (prop.group == 'Command') {
                        return $('div').class('prop cmd').append(
                            $('input')
                                .type('checkbox')
                                .name(name)
                                .id(name)
                                .value(1)
                                .checked(value)
                                .on('change', e => values[name] = e.target.checked ? 1 : 0),
                            // $('label').for(name),
                            $('label').text(prop.title).for(name),
                        )
                    }
                    if (prop.group == 'Info') {
                        return $('div').class('prop').append(
                            $('label').text(prop.title),
                            $('span').text(value),
                        )
                    }
                    if (prop.group == 'State') {
                        return $('div').class('prop state').value(value).append(
                            $('span'),
                            $('label').text(prop.title),
                        )
                    }
                    if (prop.group == 'Input') {
                        return $('div').class('prop state').value(value).append(
                            $('span'),
                            $('div').class('p-io').text([
                                prop.moduleNr,
                                prop.moduleId,
                                prop.index,
                            ].join('.')),
                            $('label').text(prop.title),
                        )
                    }
                    if (prop.group == 'Output') {
                        return $('div').class('prop state').value(value).append(
                            $('span'),
                            $('div').class('p-io').text([
                                prop.moduleNr,
                                prop.moduleId,
                                prop.index,
                            ].join('.')),
                            $('label').text(prop.title),
                        )
                    }
                    if (prop.group == 'Axis') {
                        return $('div').class('prop axis').append(
                            $('div').text(prop.title),
                            $('input').class('form-element').type('number').id(prop.name + 'Pos').value(prop.pos),
                            $('input').class('form-element').type('number').id(prop.name + 'Speed').value(prop.speed),
                            $('input').class('form-element').type('number').id(prop.name + 'Accel').value(prop.accel),
                            $('input').class('form-element').type('number').id(prop.name + 'Decel').value(prop.decel),
                            $('input').class('form-element').type('number').id(prop.name + 'Jerk').value(prop.jerk),
                        )
                    }
                    return $('div').class('prop').append(
                        $('div').text(prop.title).style('flex: 0 0 60%;'),
                        input(key, prop),
                        $('div').text(prop.unit),
                        prop.proc ? [
                            $('input')
                                .class('form-element')
                                .value((values[key] || {})[prop.name + 'proc'] || prop.proc).name(prop.name + 'proc').type(prop.type).step(10).min(0).max(100),
                            $('div').text('%'),
                        ] : null,
                    )
                }
                $('.main').clear()
                $('div').parent('.main').class('image').style(`background-image: url(https://portal.polymac.nl/assets/images/art/bme/bmm-bmf.png);`).append(
                    $('div').class('signal').append(
                        $('div').class('red'),//.text('🔴'),
                        $('div').class('yellow'),//.text('🟡'),
                        $('div').class('blue'),//.text('🔵'),
                        $('div').class('green'),//.text('🟢'),
                        $('div').class('white'),//.text('⚪'),
                    ),
                );
                $('.main').append(
                    $('div').style('overflow:auto;').append(
                        Object.values(sbs).map(sbs => hmi.sbs(sbs, items)),
                    ),
                );
                return;
                $('body>main').clear().append(
                    $('nav').class('bar sub').append(
                        Object.entries(data.hmi.system).map(([key, properties]) => $('button').text(key).on('click', async (e) => {
                            formkey = key;
                            $('main>form').clear().append(
                                $('details').open(1).append(
                                    $('summary').class('system').text(key),
                                    properties.map(p => p.group).unique().map(group => $('details').open(1).append(
                                        $('summary').class('group').text(key, group),
                                        $('div').class('props', group).append(
                                            properties
                                                .filter(prop => prop.group == group && (prop.name || prop.title))
                                                .map(prop => propdiv(key, prop)),
                                        )
                                    )),

                                )
                            );
                        })),
                    ),
                    $('form').style('flex: 1 1 0;').on('change', e => {
                        e.preventDefault();
                        var { value } = e.target;
                        if (e.target.matches('input[type="checkbox"]')) {
                            value = e.target.checked ? 1 : 0;
                        }
                        hmi.set(e.target.name, value);
                        // const formData = new FormData(e.target.form);
                        // const values = Object.fromEntries(formData);
                        // // this.values = Object.fromEntries(Object.entries(this.values).filter(([k,v]) => v))
                        // Object.assign(this.values,values);
                        // // this.values = Object.fromEntries(Object.entries(this.values).filter(([k,v]) => v))
                        // console.log(this.values);
                        // fetch(this.urlvalues, {
                        //   method: 'POST',
                        //   body: JSON.stringify(this.values),
                        // })
                    }).append(
                        $('div').text('Polymac').style('font-size:3em;'),
                        $('div').class('image').style(`background-image: url(../assets/images/240590.png);`).append(
                            // $('img').src('../assets/images/240590.png'),
                            data.alarms.filter(r => r.pos).map(row => $('i').class('alarm').attr(row).style(`left:${row.pos[0]}px;top:${row.pos[1]}px;`))
                        ),
                        data.info.filter(row => row.level == 1).map(row => $('div').append(
                            $('span').text(row.title),
                            $('span').text(row.value),
                        ))
                    ),
                    $('section').class('alarms small').style('flex: 0 1 auto;max-height: 136px;'),
                    $('nav').class('bar sub').append(
                        $('div').class('title'),
                        'refresh,io,auto'.split(',').map(key => $('button').class(key).on('click', e => hmi[key]())),
                    ),
                )
                hmi.showAlarms();

            },
            async alarms() {
                const btns = {
                    tool() {
                        console.log('tool');
                    },
                    search() {
                        console.log('tool');
                    },
                    sel() {
                        console.log('tool');
                    },
                    del() {
                        console.log('tool');
                    },
                    doc() {
                        console.log('tool');
                    },
                    back() {
                        console.log('tool');
                    },
                    pause() {
                        console.log('tool');
                    },
                    list() {
                        console.log('tool');
                    },
                    open() {
                        console.log('tool');
                    },
                    check() {
                        console.log('tool');
                    },
                    help() {
                        console.log('tool');
                    },
                    // filter() {
                    //   console.log('tool');
                    // },
                }
                $('body>main').clear().append(
                    $('header').text('Alarm'),
                    $('section').class('alarms all'),
                    // .append(
                    //   hmi.data.alarms.filter(a => a.active || a.visible).sort((a,b) => a.prio - b.prio).map(a => hmi.divalarm(a).on('click', e => {
                    //     a.visible = false;
                    //     hmi.alarms();

                    //   })),
                    // ),
                );
                hmi.showAlarms();

            },
            menu() {
                const submenu = {
                    estop() {
                        $('.title').text('E Stop');
                    },
                    euromap() {
                        $('.title').text('Euromap');
                    },
                    async io() {

                        // ioList.forEach((row, i) => row.i = i)
                        function iorow(row) {
                            const elem = $('div').class('io').attr({
                                safety: row.safety,
                                type: row.type,
                                dir: row.dir,
                            }).append(
                                $('i').on('click', e => {
                                    // console.log(row.dir, e.target)
                                    if (row.dir == 'O') {
                                        elem.attr({
                                            state: mqttClient.setNameValue(row.name, row.state ^= 1),
                                        })
                                    }
                                }),
                                $('div').text(row.io),
                                // $('div').text(row.text1),
                                $('div').text(row.descr_nl),
                            );
                            return elem;
                        }
                        $('.title').text('IO');
                        $('main>form').clear().append(
                            modules.map(module => $('details').append(
                                $('summary').text(module.name),
                                module.io.map(iorow),
                            )),
                            // // $('header').text('IO'),
                            // ioList.filter(row => row.nederlands)
                            //     .sort((a, b) => String(a.text1).localeCompare(b.text1))
                            //     .map(iorow),
                            // $('header').text('IO blokken'),
                            // ioList.filter(row => row.io)
                            //     .sort((a, b) => a.i - b.i)
                            //     .map(iorow),
                        );
                    },
                    packml() {
                        $('.title').text('Pack ML');
                    },
                    counters() {
                        $('.title').text('Counters');
                    },
                    dashboard() {
                        const { dashboard } = this.data;
                        $('.title').text('Dashboard');
                        $('main>form').clear().append(
                            dashboard.map(row => $('div').append(
                                $('div').text(row.title),
                            )),
                        );
                    },
                };
                $('.main').clear().append(
                    $('nav').class('bar sub').append(
                        $('div').class('title'),
                        hmi.menubuttons(submenu),
                    ),
                    $('form'),
                );
            },
            async recipes() {
                var groep;
                console.log({ data, omstellijst });
                // console.log(omstellijst.map(r => `## ${r.nr} ${r.nl}`).join('\n\n'))
                omstellijst.forEach(row => row.groep = groep = row.groep ? row[lang] || row.groep : groep);
                function setProd(prodName, mhName) {
                    localStorage.setItem("prodName", prodName);
                    localStorage.setItem("mhName", mhName);
                    const rows = (data[prodName] || {})[mhName] || {};
                    // console.log({ prodName, mhName, rows });
                    $('h1.sel').text(`Omstellijst: ${prodName} @ ${pmnr} + ${mhName}`);
                    $('table>tbody').clear().append(
                        omstellijst.map(row => row.group).unique().map(group => [
                            $('tr').append(
                                $('td'),
                                $('td').text(group).style('font-weight:bold;'),
                            ),
                            omstellijst.filter(row => row.group === group && row.t && rows[row.nr]).map(row => $('tr').append(
                                $('td').class('nr').text(row.nr).on('click', e => openMarkdown(`/sites/polymac/doc/manual/${info.type}-oper-en.md`, row.nr)),
                                $('td').append(
                                    row.img ? $('img').src(`/assets/images/productset/${row.img}`).style('max-height:120px;') : null,
                                    $('div').text(row[lang]),
                                ),
                                $('td').text(row.t),
                                $('td').text(row.extra),
                                $('td').append(
                                    $('input').value(rows[row.nr]).on('change', e => {
                                        rows[row.nr] = e.target.value;
                                        // console.log(data);
                                        api('/inst/config', { uid }, { data: jsyaml.dump(data) }).then(console.log);
                                    })
                                ),
                            ))
                        ]),
                    )
                }
                $('body>main').clear().append(
                    $('div').style('overflow:auto;').append(
                        $('ol').append(
                            Object.entries(data).map(([prodName, prod]) => $('li').text(prodName).append(
                                Object.entries(prod).map(([mhName, mh]) => $('button').text(mhName).style('cursor:pointer;').on('click', e => setProd(prodName, mhName))),
                            )),
                        ),
                        $('h1').class('sel'),
                        $('table').class('grid').style('white-space:nowrap;table-layout:fixed;').append(
                            $('thead').append(
                                $('tr').append(
                                    $('th').text('Nr'),
                                    $('th').text('Description'),
                                    $('th').text('T'),
                                    $('th').text('Extra'),
                                    $('th').text(prod),
                                ),
                            ),
                            $('tbody'),
                        ),
                    ),
                );
                setProd(localStorage.getItem("prodName"), localStorage.getItem("mhName"));
                return;
                docIndex(6);



                const { recipes } = cmdb;
                console.log(recipes);
                $('.main').clear().append(
                    recipes.map(row => $('details').append(
                        $('summary').text(row.name),
                        Object.entries(row.adjustment_list).map(([name, unit]) => $('details').append(
                            $('summary').text(name),
                            Object.entries(unit).map(([name, em]) => $('details').append(
                                $('summary').text(name),
                                Object.entries(em).map(([name, val]) => $('div').class('btn-parameter').append(
                                    $('label').text(name),
                                    $('input').value(val),
                                )),
                            )),
                        )),
                    ))
                )

                return;
                $('.title').text('Recipes');
                $('body>main').clear().append(
                    $('nav').append(
                        Object.entries(pnode.menu.recipes.nav).map(([name, onclick]) => $('button').text(name).on('click', onclick)),
                        // $('button').text('Job change').on('click', e => {
                        //   const header = 'JobID,JobRun,WorkOrderID,MachineID,Timestamp'.split(',').map(name => Object({
                        //     id: name, 
                        //     title: name 
                        //   }));
                        //   setValue('/aspect/jobchange', {
                        //     // path: `/JobChange-${getTimestamp()}.csv`,
                        //     header,
                        //     rows: [
                        //       {
                        //         // DateTime: new Date().toISOString(),
                        //         // JobID: row.JobID,
                        //         // JobRun: row.JobRun,
                        //         // MaterialID: row.MaterialID,
                        //         // LBLNAME: row.LBLNAME,
                        //         DateTime: new Date().toISOString(),
                        //         JobID: 's',
                        //         JobRun: 1,
                        //         MaterialID: 3,
                        //         LBLNAME: 'fsdfgs',
                        //       },
                        //     ],
                        //   });

                        //   // const row = rows[1];
                        //   // if (row) {
                        //   //   // setValue('/aspect/jobchange', {
                        //   //   //   DateTime: new Date().toISOString(),
                        //   //   //   JobID: row.JobID,
                        //   //   //   JobRun: row.JobRun,
                        //   //   //   MaterialID: row.MaterialID,
                        //   //   //   LBLNAME: row.LBLNAME,
                        //   //   // });

                        //   //   // setValue('/aspect/jobchange', {
                        //   //   //   DataCount: 13,
                        //   //   //   JobID: row.JobID,
                        //   //   // });
                        //   //   // setValue('/aspect/batchdata', {
                        //   //   //   rows,
                        //   //   //   source: 'Job Change',
                        //   //   // })
                        //   // }
                        // }),
                        // $('button').text('Rejects').on('click', e => {
                        //   const rows = [
                        //     {
                        //       DateTime: new Date().toISOString(),
                        //       JobID: '34523523',//rows[0].JobID,
                        //       RejectReasonCode: 1,
                        //       Quantity: 36,
                        //     }
                        //   ];
                        //   console.log({rows})
                        //   setValue('/aspect/rejects', {rows});
                        // }),
                        // $('button').text('Finished Cartons').on('click', e => {
                        //   const row = {
                        //     DateTime: new Date().toISOString(),
                        //     JobID: rows[0].JobID,
                        //     BoxQtyActual: 1,
                        //     FinishedCartons: 300,
                        //   };
                        //   console.log({row})
                        //   setValue('/aspect/finishedcartons', row);
                        // }),
                    ),
                    recipes.map(row => $('div').append(
                        $('div').text(row.title),
                    )),
                );
            },
            setup2() {
                $('.title').text('Setup');
            },
            async info() {
                console.log('info', { cmdb });
                $('body>main').clear().append(
                    $('h1').text('IO List'),
                );
                return;
                $('body>main').clear().append(
                    $('div').class('info').append([
                        String(await fetch('/polymac/hmi/assets/md/manual-09-en.md').then(e => e.text()))
                    ].join('').render())
                );
            },
        },
        tool2() {
            $('.title').text('Tools');
        },
        showAlarms() {
            $('section.alarms').clear().append(
                hmi.data.alarms.filter(a => a.active || a.visible).sort((a, b) => a.prio - b.prio).map(a => hmi.divalarm(a).on('click', e => {
                    a.visible = false;
                    hmi.alarms();

                })),
            )
        },
        init1() {

        },
        async api(path) {
            return fetch('/api' + path).then(e => e.json());
        },
        set(name, value) {
            console.log('set', name, value)
            this.values[name] = value;
            setValue(`${uid}/hmi/${name}`, value);
            document.querySelectorAll('#' + name).forEach(e => e.value = value)
            fetch(this.urlvalues, {
                method: 'POST',
                body: JSON.stringify(this.values),
            })
            return value;
        },
        divalarm(row) {
            return $('div').attr(row).append(
                $('div').class('type'),
                $('div').class('state'),
                $('div').text(row.title),
                $('div').text(row.value),
                $('div').text(row.on ? row.on.toLocaleString() : null),
                $('div').text(row.level),
            );
        },
        login() {
            $('body>main').clear().append(
                $('form').append(
                    $('div').append(
                        $('input').placeholder('Accountname'),
                    ),
                    $('div').append(
                        $('input').placeholder('Password'),
                    ),
                    $('nav').append(
                        $('input').type('submit'),
                    ),
                ).on('submit', e => {
                    e.preventDefault();
                    hmi.home();
                }),
            )
        },
        packml2() {
            $('.title').text('Pack ML');
        },
        setup() {
            const { menu } = this.data.hmi;
            $('body>main').clear().append(
                $('nav').class('bar sub').append(
                    $('div').class('title'),
                    'tool2,packml2,setup2'.split(',').map(key => $('button').class(key).on('click', e => hmi[key]())),
                ),
                $('form'),
            );
        },
        refresh() {
            location.reload();
        },
        async init() {
            // LET OP, Onderstaande regel is nodig bij gebruik nodejs server
            // Object.assign(cmdb,await fetch(`api/cmdb`).then(e => e.json()));
            console.log({ cmdb });
            // this.start();
            //console.log(this,uid);
            const { data, values } = this;
            const urlvalues = this.urlvalues = `https://pagesgroup.aliconnect.nl/api/${uid}-000-values.yaml`;
            Object.assign(data, await fetch(`https://pagesgroup.aliconnect.nl/api/hmi.yaml`).then(e => e.json()));
            Object.assign(data, await fetch(`https://pagesgroup.aliconnect.nl/api/${uid}-000-cmdb.yaml`).then(e => e.json()));
            Object.assign(values, await fetch(urlvalues).then(e => e.json()));
            // return $(document.body).text(this.uid);
            data.ioLijst.forEach(row => Object.assign(row, {
                system: row.system,
                equipment: row.equipment || row.text2 || row.text1,
                group: row.dir == 'I' ? 'Input' : 'Output',
                title: [
                    row.text2,
                    row.text3,
                    row.text4,
                    row.channel,
                    row.color,
                    row.valve,
                    row.cylinder,
                    row.relais,
                    row.function,
                    row.input,
                    row.remark1,
                    row.remark2,
                ].join(' '),
            }));
            data.ioLijst.filter(row => row.system)
                .sort((a, b) => a.title.localeCompare(b.title))
                .forEach(row => data.properties.push(row));
            let formkey;
            data.hmi.system = Object.fromEntries(data.properties.map(row => row.system).unique().map(system => [system, data.properties.filter(prop => prop.system == system)]))
            console.log(data, values);
            // console.log('init');
            $(document.body).style('display:flex;flex-direction:column;').append(
                $('nav').class('bar').append(
                    Object.entries(data.hmi.nav1).map(([key, row]) => $('button').class(key).on('click', e => this[key]())),
                ),
                $('main'),
            );
            // this.home();
        },
        async init() {
            // LET OP, Onderstaande regel is nodig bij gebruik nodejs server
            // Object.assign(cmdb,await fetch(`api/cmdb`).then(e => e.json()));
            // console.log(3, { cmdb });
            $(document.body).style('display:flex;flex-direction:column;').append(
                $('nav').class('bar').append(
                    hmi.menubuttons(hmi.topmenu),
                ),
                $('main').class('main').append(
                    // $('div').class('plc').id('plc1'),
                    // $('div').class('machine').id('machine1'),
                    // $('div').class('axis').id('axis1'),
                    // $('div').class('axis').id('axis2'),
                    // $('div').class('axis').id('axis3'),
                    // modules.map(row => $('li').append(
                    //     $('span').text(row.omschrijving),
                    // ))
                ),
                $('footer').class('footer'),
            );
            let blink = 0;
            setInterval(e => $(document.body).attr('blink', blink ^= 1), 500)
        },
    }
    // console.log(2, { hmi });
    // window.addEventListener('load', e => hmi.init());
    hmi.init();
    hmi.topmenu.home();
    return hmi;
})();
