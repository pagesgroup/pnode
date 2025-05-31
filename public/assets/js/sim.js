const url = new URL(document.location);
const mqttbroker = url.searchParams.get('mqttbroker'); // aliconnect.nl
const mqttport = +url.searchParams.get('mqttport'); // 1338
// const uid = +url.searchParams.get('uid'); 
function setValue(topic, value) {
  const message = new Paho.MQTT.Message(String(value));
  message.destinationName = topic;
  mqttClient.send(message);
}
var mqttClient = new Paho.MQTT.Client(mqttbroker, mqttport, "myclientid_" + parseInt(Math.random() * 100, 10));
 mqttClient.onConnectionLost = function(responseObject) {
  console.error("connection lost: " + responseObject.errorMessage);
};
mqttClient.onMessageArrived = function(message) {
  const name = message.destinationName.split('/').pop();
  const value = message.payloadString;
  console.debug(name, '=', value);
  // document.querySelectorAll(`[name="${name}"]`).forEach(e => $(e).value(value));
  // document.querySelectorAll(`#${name}`).forEach(e => $(e).value(value));
  hmi.set(name, message.payloadString);
};
var options = {
  useSSL: url.searchParams.get('ssl') ? true : false,
  timeout: 3,
  onSuccess() {
    console.log("mqtt connected");
    // Subscribe to all topics under 'polymac/pnode/'
    mqttClient.subscribe(`${hmi.uid}/hmi/#`, { qos: 1 });
  },
  onFailure(message) {
    console.log("Connection failed: " + message.errorMessage);
  }
};
mqttClient.connect(options);



// console.log('hmi1');
hmi = {
  data: {},
  values: {},
  async api(path) {
    return fetch('/api' + path).then(e => e.json());
  },
  set(name,value){
    // console.log('set',name,value)
    this.values[name] = value;
    setValue(`${hmi.uid}/plc/${name}`,value);
    document.querySelectorAll(`[name="${name}"]`).forEach(e => $(e).value(value));
    document.querySelectorAll('#'+name).forEach(e => e.value = value)
    // $('#'+name).value(value);
    fetch(this.urlvalues, {
      method: 'POST',
      body: JSON.stringify(this.values),
    })
  },
  home() {
    const {data,values} = this;
    console.log(data);
    function input(key,prop) {
      const name = [prop.system,prop.equipment,prop.title].filter(Boolean).join(' ').toCamelCase();
      const value = values[name] || prop.default;
      if(prop.options) {
        const attr = {};
        return $('select')
        .class('form-element')
        .name(name)
        .append(
          prop.options.split('|').map((cap,i) => $('option')
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
    function propdiv(key,prop) {
      const name = [prop.system,prop.equipment,prop.title].filter(Boolean).join(' ').toCamelCase();
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
          $('div').text(prop.pos),
          $('div').text(prop.speed),
          $('div').text(prop.accel),
          $('div').text(prop.decel),
          $('div').text(prop.jerk),
        )
      }
      return $('div').class('prop').append(
        $('div').text(prop.title).style('flex: 0 0 60%;'),
        input(key,prop),
        $('div').text(prop.unit),
        prop.proc ? [
          $('input')
          .class('form-element')
          .value((values[key]||{})[prop.name+'proc'] || prop.proc).name(prop.name+'proc').type(prop.type).step(10).min(0).max(100),
          $('div').text('%'),
        ] : null,
      )
    }
    $('body>main').clear().append(
      $('nav').class('bar sub').append(
        Object.entries(data.hmi.system).map(([key,properties]) => $('button').text(key).on('click', async (e) => {
          formkey = key;
          $('main>form').clear().append(
            $('details').open(1).append(
              $('summary').class('system').text(key),
              properties.map(p => p.group).unique().map(group => $('details').open(1).append(
                $('summary').class('group').text(key, group),
                $('div').class('props',group).append(
                  properties
                  .filter(prop => prop.group == group && (prop.name || prop.title))
                  .map(prop => propdiv(key,prop)),
                )
              )),

            )
          );
        })),
      ),
      $('form').on('change', e => {
        e.preventDefault();
        var {value} = e.target;
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
      $('nav').class('bar sub').append(
        $('div').class('title'),
        'refresh,io,auto'.split(',').map(key => $('button').class(key).on('click', e => hmi[key]())),
      ),
    )
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
      $('section').class('alarms').append(
        this.data.alarms
        // .filter(row => row.type == 'ADMSG')
        .map(row => $('div').attr(row).append(
          $('div').class('type'),
          $('div').class('state'),
          $('div').text(row.title),
          $('div').text(row.value),
          $('div').text(row.time),
          $('div').text(row.level),
        )),
      ),
      $('nav').class('btns').append(
        Object.entries(btns).map(([key,fn]) => $('button').type('button').class(key).on('click', fn)),
      ),
      $('div').append(
        $('input'),
      ),
    );
  },
  recipes() {
    const {recipes} = this.data;
    $('.title').text('Recipes');
    $('body>main').clear().append(
      recipes.map(row => $('div').append(
        $('div').text(row.title),
      )),
    );
  },
  dashboard() {
    const {dashboard} = this.data;
    $('.title').text('Dashboard');
    $('main>form').clear().append(
      dashboard.map(row => $('div').append(
        $('div').text(row.title),
      )),
    );
  },
  euromap() {
    $('.title').text('Euromap');
  },
  packml() {
    $('.title').text('Pack ML');
  },
  estop() {
    $('.title').text('E Stop');
  },
  counters() {
    $('.title').text('Counters');
  },
  setup2() {
    $('.title').text('Setup');
  },
  tool2() {
    $('.title').text('Tools');
  },
  packml2() {
    $('.title').text('Pack ML');
  },
  async info() {
    $('body>main').clear().append(
      $('div').class('info').append([
        String(await fetch('/polymac/hmi/assets/md/manual-09-en.md').then(e => e.text()))
      ].join('').render())
    );
  },
  menu() {
    const {menu} = this.data.hmi;
    $('body>main').clear().append(
      $('nav').class('bar sub').append(
        $('div').class('title'),
        'estop,euromap,io,packml,counters,dashboard'.split(',').map(key => $('button').class(key).on('click', e => hmi[key]())),
      ),
      $('form'),
    );
  },
  setup() {
    const {menu} = this.data.hmi;
    $('body>main').clear().append(
      $('nav').class('bar sub').append(
        $('div').class('title'),
        'tool2,packml2,setup2'.split(',').map(key => $('button').class(key).on('click', e => hmi[key]())),
      ),
      $('form'),
    );
  },
  
  async io() {
    this.data.ioLijst.forEach((row,i) => row.i = i)
    function iorow(row) {
      const elem = $('div').class('io').attr({
        safety: row.safety,
        type: row.type,
        dir: row.dir,
      }).append(
        $('i').on('click', e => {
          console.log(row.dir,e.target)
          if (row.dir == 'O') {
            elem.attr({
              state: row.state^=1,
            })
          }
        }),
        $('div').text(row.io),
        $('div').text(row.text1),
        $('div').text(row.nederlands),
      );
      return elem;
    }
    $('.title').text('IO');
    $('main>form').clear().append(
      // $('header').text('IO'),
      this.data.ioLijst.filter(row => row.nederlands)
      .sort((a,b) => String(a.text1).localeCompare(b.text1))
      .map(iorow),
      $('header').text('IO blokken'),
      this.data.ioLijst.filter(row => row.io)
      .sort((a,b) => a.i - b.i)
      .map(iorow),
    );
  },
  refresh() {
    location.reload();
  },
  async init(uid) {
    uid = uid || localStorage.getItem("uid");
    if (!uid) {
      uid = prompt("Please enter your uid");
      localStorage.setItem("uid", uid);
    }
    console.log({uid})
    Object.assign(this,{uid});
    // this.start();
    console.log(this,this.uid);
    const {data,values} = this;
    const urlvalues = this.urlvalues = `https://pagesgroup.aliconnect.nl/api/${this.uid}-000-values.yaml`;
    Object.assign(data, await fetch(`https://pagesgroup.aliconnect.nl/api/hmi.yaml`).then(e => e.json()));
    Object.assign(data, await fetch(`https://pagesgroup.aliconnect.nl/api/${this.uid}-000-cmdb.yaml`).then(e => e.json()));
    Object.assign(values, await fetch(urlvalues).then(e => e.json()));
    // return $(document.body).text(this.uid);
    data.ioLijst.forEach(row => Object.assign(row,{
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
    .sort((a,b) => a.title.localeCompare(b.title))
    .forEach(row => data.properties.push(row));
    let formkey;
    data.hmi.system = Object.fromEntries(data.properties.map(row => row.system).unique().map(system => [system, data.properties.filter(prop => prop.system == system)]))
    console.log(data,values);
    data.axis.forEach((row,i,list) => list[row.name] = row);
    data.axis.forEach(axis => {
      axis.pos = 0;
      axis.target = 50;
    });
    $(document.body).append(
      $('div').append(
        $('input').type('checkbox').on('change', e => data.run = e.target.checked),
        $('label').text('Run'),
      ),
      data.axis.map(axis => $('div').append(
        $('div').text(axis.name),
        $('input').type("range").id(axis.name+"target").name(axis.name+"target").min("0").max("100"),
        // $('label').for(axis.name+"target").text('target'),
        // $('label').for(axis.name).text('Position Axis 45'),
        $('meter').id(axis.name+'Pos').value(axis.pos=axis.pos||50).min("0").max("100"),//.text('2 out of 10'),
      )),
      data.alarms.map((alarm,i) => $('div').append(
        $('input').id('alarm'+i).type('checkbox').on('change', e => {
          alarm.checked = e.target.checked;
          // var base2 = (yourNumber).toString(2);
          const intValue = parseInt(data.alarms.map(r => r.checked ? 1 : 0).reverse().join(''), 2);
          console.log({intValue,alarm})
          hmi.set('alarms', intValue);
        }),
        $('label').text(alarm.title).for('alarm'+i),
      ))
    );
    var stepnr;
    const steps = [
      {
        init() {
          data.axis.centrering.target = 60;
          data.axis.mattenBand.target = 10;
          data.axis.draaienStappelaar.target = 10;
          data.axis.stappelaar.target = 10;
          data.axis.transportLinks.target = 10;
        },
        check() {
          if (data.axis.centrering.pos == 60) {
            dostep(1);
          }
        },
      },
      {
        init() {
          data.axis.productInvoer.target = 60;
        },
        check() {
          if (data.axis.productInvoer.pos == 60) {
            dostep(2);
          }
        },
      },
      {
        init() {
          data.axis.centrering.target = 20;
          data.axis.mattenBand.target = 70;
          data.axis.mattenBand.target = 70;
          data.axis.draaienStappelaar.target = 70;
          data.axis.stappelaar.target = 70;
          data.axis.transportLinks.target = 70;
        },
        check() {
          if (data.axis.centrering.pos == 20) {
            dostep(3);
          }
        },
      },
      {
        init() {
          data.axis.productInvoer.target = 20;
        },
        check() {
          if (data.axis.productInvoer.pos == 20) {
            dostep(0);
          }
        },
      },
    ];
    function dostep(nr) {
      steps[nr].init();
      stepnr = nr;
    }
    dostep(0);

    setInterval(e => {
      if (data.run) {
        data.axis.forEach(axis => {
          const {target,pos} = axis;
          $('#'+axis.name+'target').value(target);
          if (target<pos) {
            hmi.set(axis.name+'Pos',axis.pos = pos-1);
          } else if (target>pos) {
            hmi.set(axis.name+'Pos',axis.pos = pos+1);
          }
        })
        steps[stepnr].check();
      }
    },100)
    
    return;
    $(document.body).style('display:flex;flex-direction:column;').append(
      $('nav').class('bar').append(
        Object.entries(data.hmi.nav1).map(([key,row]) => $('button').class(key).on('click', e => this[key]())),
      ),
      $('main'),
    );
    // this.home();
  },
}
console.log({hmi});
window.addEventListener('load', e => hmi.init(url.searchParams.get('uid')));