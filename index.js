// Name: CLΔ Core
// ID: cldeltacore
// Description: Essentials for P2P network connectivity.
// By: MikeDEV <https://scratch.mit.edu/users/MikeDEVTheDucklord/>
// License: MIT

/*
    CloudLink Delta Core Extension

    MIT License

    Copyright (C) 2025 CloudLink Delta.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

/*
    https://github.com/peers/peerjs
    
    (source: https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js)

    Copyright (c) 2015 Michelle Bu and Eric Zhang, http://peerjs.com

    The MIT License

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function (Scratch) {
  'use strict'

  // DO NOT INCREMENT THIS VALUE UNLESS A SIGNIFICANT CHANGE TO THE PROTOCOL IS INTENDED
  const DIALECT_REVISION = 0

  // Extension version information
  const EXTENSION_VERSION = {
    type: 'Scratch', // Do not change this
    major: 1,
    minor: 0,
    patch: 0
  }

  // Dynamically load PeerJS dependencies
  const PEERJS_SOURCES = [
    'https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js',
    'https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js'
  ]

  // Default arguments to use for the extension
  const SESSION_SERVER = {
    host: 'peerjs.mikedev101.cc',
    port: 443,
    secure: true,
    path: '/',
    key: 'peerjs',
    connectTimeoutMs: 10000,
    config: {
      iceTransportPolicy: 'all',
      iceServers: [
        {
          urls: 'stun:vpn.mikedev101.cc:3478'
        },
        {
          urls: 'turn:vpn.mikedev101.cc:3478',
          username: 'free',
          credential: 'free'
        },
        {
          urls: 'stun:vpn.mikedev101.cc:5349'
        },
        {
          urls: 'turn:vpn.mikedev101.cc:5349',
          username: 'free',
          credential: 'free'
        }
      ]
    }
  }

  const blockIcon =
    'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%22312%22%20height%3D%22218%22%20viewBox%3D%220%200%20312%20218%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M155.88%200C194.829%200.000212318%20226.786%2030.1084%20229.987%2068.4414H237.391C278.466%2068.4414%20311.759%20101.922%20311.759%20143.221C311.759%20184.52%20278.466%20218%20237.391%20218H74.3682C33.2934%20218%200%20184.52%200%20143.221C0.000123011%20101.922%2033.2935%2068.4415%2074.3682%2068.4414H81.7715C84.9733%2030.1082%20116.931%200%20155.88%200ZM155.88%2010C122.221%2010%2094.5136%2036.0335%2091.7373%2069.2744L90.9717%2078.4414H74.3682C38.8684%2078.4415%2010.0001%20107.392%2010%20143.221C10%20179.049%2038.8683%20208%2074.3682%20208H237.391C272.891%20208%20301.759%20179.049%20301.759%20143.221C301.759%20107.392%20272.891%2078.4414%20237.391%2078.4414H220.788L220.023%2069.2744C217.246%2036.0337%20189.539%2010.0002%20155.88%2010Z%22%20fill%3D%22white%22%2F%3E%3Cpath%20d%3D%22M109.5%20180V172.5L149.85%2072.4502H162L202.2%20172.5V180H109.5ZM124.95%20167.85H186.6L161.55%20102.45C161.25%20101.65%20160.7%20100.2%20159.9%2098.1002C159.1%2096.0002%20158.3%2093.8502%20157.5%2091.6502C156.8%2089.3502%20156.25%2087.6002%20155.85%2086.4002C155.35%2088.4002%20154.75%2090.4502%20154.05%2092.5502C153.45%2094.5502%20152.8%2096.4002%20152.1%2098.1002C151.5%2099.8002%20151%20101.25%20150.6%20102.45L124.95%20167.85Z%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E'

  const menuIcon =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzczIiBoZWlnaHQ9IjM3MyIgdmlld0JveD0iMCAwIDM3MyAzNzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjE4Ni41IiBjeT0iMTg2LjUiIHI9IjE4Ni41IiBmaWxsPSIjMEY3RUJEIi8+CjxwYXRoIGQ9Ik0xODYuODggNjFDMjI1LjgyOSA2MS4wMDAyIDI1Ny43ODYgOTEuMTA4NCAyNjAuOTg3IDEyOS40NDFIMjY4LjM5MUMzMDkuNDY2IDEyOS40NDEgMzQyLjc1OSAxNjIuOTIyIDM0Mi43NTkgMjA0LjIyMUMzNDIuNzU5IDI0NS41MiAzMDkuNDY2IDI3OSAyNjguMzkxIDI3OUgxMDUuMzY4QzY0LjI5MzQgMjc5IDMxIDI0NS41MiAzMSAyMDQuMjIxQzMxLjAwMDEgMTYyLjkyMiA2NC4yOTM1IDEyOS40NDIgMTA1LjM2OCAxMjkuNDQxSDExMi43NzJDMTE1Ljk3MyA5MS4xMDgyIDE0Ny45MzEgNjEgMTg2Ljg4IDYxWk0xODYuODggNzFDMTUzLjIyMSA3MSAxMjUuNTE0IDk3LjAzMzUgMTIyLjczNyAxMzAuMjc0TDEyMS45NzIgMTM5LjQ0MUgxMDUuMzY4QzY5Ljg2ODQgMTM5LjQ0MiA0MS4wMDAxIDE2OC4zOTIgNDEgMjA0LjIyMUM0MSAyNDAuMDQ5IDY5Ljg2ODMgMjY5IDEwNS4zNjggMjY5SDI2OC4zOTFDMzAzLjg5MSAyNjkgMzMyLjc1OSAyNDAuMDQ5IDMzMy43NTkgMjA0LjIyMUMzMzIuNzU5IDE2OC4zOTIgMzAzLjg5MSAxMzkuNDQxIDI2OC4zOTEgMTM5LjQ0MUgyNTEuNzg4TDI1MS4wMjMgMTMwLjI3NEMyNDguMjQ2IDk3LjAzMzcgMjIwLjUzOSA3MS4wMDAyIDE4Ni44OCA3MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNDAuNSAyNDFWMjMzLjVMMTgwLjg1IDEzMy40NUgxOTNMMjMzLjIgMjMzLjVWMjQxSDE0MC41Wk0xNTUuOTUgMjI4Ljg1SDIxNy42TDE5Mi41NSAxNjMuNDVDMTkyLjI1IDE2Mi42NSAxOTEuNyAxNjEuMiAxOTAuOSAxNTkuMUMxOTAuMSAxNTcgMTg5LjMgMTU0Ljg1IDE4OC41IDE1Mi42NUMxODcuOCAxNTAuMzUgMTg3LjI1IDE0OC42IDE4Ni44NSAxNDcuNEMxODYuMzUgMTQ5LjQgMTg1Ljc1IDE1MS40NSAxODUuMDUgMTUzLjU1QzE4NC40NSAxNTUuNTUgMTgzLjggMTU3LjQgMTgzLjEgMTU5LjFDMTgyLjUgMTYwLjggMTgyIDE2Mi4yNSAxODEuNiAxNjMuNDVMMTU1Ljk1IDIyOC44NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='

  // Require the extension to be unsandboxed
  if (!Scratch.extensions.unsandboxed) {
    alert(
      'The CloudLink Delta extension must be loaded in an unsandboxed environment.'
    )
    return
  }

  // Require access to the VM and/or runtime
  if (!Scratch.vm || !Scratch.vm.runtime) {
    alert(
      "The CloudLink Delta extension could not detect access to the Scratch VM and/or runtime; this extension won't work."
    )
    return
  }

  // Require browser to support Web Locks API (used for concurrency)
  if (!navigator.locks) {
    alert(
      "The CloudLink Delta extension could not detect Web Locks support; this extension won't work."
    )
    return
  }

  // Initialize the plugin loader
  if (!Scratch.vm.runtime.ext_cldelta_pluginloader) {
    Scratch.vm.runtime.ext_cldelta_pluginloader = new Array()
  }

/*
		Block utilities for creating blocks with less code.
		Based on Rotur.js by Mistium
		https://extensions.mistium.com/featured/Rotur.js

		MPL-2.0
		This Source Code is subject to the terms of the Mozilla Public License, v2.0,
		If a copy of the MPL was not distributed with this file,
		Then you can obtain one at https://mozilla.org/MPL/2.0/
	*/
  // Defines a set of block types
  const opcodes = {
    conditional: (opcode, text, options = {}) => ({
      opcode,
      text: text.map(v => Scratch.translate(v)),
      blockType: Scratch.BlockType.CONDITIONAL,
      branchCount: text.length - 1,
      ...options
    }),

    reporter: (opcode, text, args = {}, options = {}) => ({
      opcode,
      blockType: Scratch.BlockType.REPORTER,
      text: Scratch.translate(text),
      arguments: args,
      ...options
    }),

    command: (opcode, text, args = {}, options = {}) => ({
      opcode,
      blockType: Scratch.BlockType.COMMAND,
      text: Scratch.translate(text),
      arguments: args,
      ...options
    }),

    boolean: (opcode, text, args = {}, options = {}) => ({
      opcode,
      blockType: Scratch.BlockType.BOOLEAN,
      text: Scratch.translate(text),
      arguments: args,
      ...options
    }),

    event: (opcode, text, options = {}) => ({
      opcode,
      blockType: Scratch.BlockType.EVENT,
      text: Scratch.translate(text),
      isEdgeActivated: false,
      ...options
    }),

    button: (text, func, options = {}) => ({
      blockType: Scratch.BlockType.BUTTON,
      text: Scratch.translate(text),
      func,
      ...options
    }),

    label: text => ({
      blockType: Scratch.BlockType.LABEL,
      text: Scratch.translate(text)
    }),

    separator: () => '---'
  }

  const args = {
    string: (value, options = {}) => ({
      type: Scratch.ArgumentType.STRING,
      defaultValue: value,
      ...options
    }),

    number: (value, options = {}) => ({
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: value,
      ...options
    }),

    boolean: (value, options = {}) => ({
      type: Scratch.ArgumentType.BOOLEAN,
      defaultValue: value,
      ...options
    })
  }

  function getTarget (targetRef, name, type = '') {
    const target =
      typeof targetRef === 'string'
        ? Scratch.vm.runtime.getTargetById(targetRef)
        : targetRef

    const findVariable = current => {
      if (!current || !current.variables) return undefined
      return Object.values(current.variables).find(
        v => v.name === name && v.type === type
      )
    }

    const localMatch = findVariable(target)
    if (localMatch) return localMatch

    const stage = Scratch.vm.runtime.getTargetForStage
      ? Scratch.vm.runtime.getTargetForStage()
      : null
    return findVariable(stage)
  }

  // Ah yes, Perry the platypus. It seems you've found my callback-inator.
  class CallbackInator {
    constructor () {
      this.calls = new Map()
      this.debug = 0
    }

    /**
     * Sets the debug level for the CallbackInator.
     *
     * @param {number} level - The desired debug level. Higher numbers enable more verbose logging.
     *
     * Adjust the verbosity of logging for debugging purposes. A higher level means more detailed logs.
     */
    set_debug_level (level) {
      this.debug = level
    }

    /**
     * Unbinds a callback function from a specified event name.
     * @param {string} name - The name of the event to unbind the callback from.
     * @param {string} id - The ID of the callback to unbind. If set to "*", all callbacks for the event will be unbound.
     * @returns {void}
     *
     * Does nothing if the callback was never bound.
     */
    unbind (name, id) {
      if (id === '*') {
        this.calls.delete(name)
        if (this.debug > 2) console.log(`Unbound all callbacks for "${name}"`)
        return
      }
      if (!this.calls.has(name) || !this.calls.get(name).has(id)) return
      this.calls.get(name).delete(id)
      if (this.debug > 2) {
        console.log(`Unbound callback for "${name}" with ID "${id}"`)
      }
    }

    /**
     * Binds a callback function to a specified event name.
     *
     * @param {string} name - The name of the event to bind the callback to.
     * @param {function} callback - The function to be called when the event is triggered.
     * @param {string} [id="default"] - An optional identifier for the callback.
     * @throws {TypeError} If the provided callback is not a function.
     */
    bind (name, callback, id = 'default') {
      if (!this.calls.has(name)) {
        this.calls.set(name, new Map())
      }
      if (typeof callback !== 'function') {
        if (this.debug > 0) console.error('Callback must be a function')
        return
      }
      this.calls.get(name).set(id, callback)
      if (this.debug > 2) {
        console.log(`Bound callback for "${name}" with ID "${id}"`)
      }
    }

    /**
     * Executes all registered callbacks for a given event name with the provided arguments.
     *
     * @param {string} name - The name of the event whose callbacks should be executed.
     * @param {...*} args - Arguments to pass to the callbacks.
     * @returns {void}
     *
     * Logs warnings if there are no callbacks registered, if the callbacks map is null,
     * if the callbacks map is empty, or if any callback is not a function. Logs an error
     * if the registered callback is not a map.
     */
    call (name, ...args) {
      if (!this.calls.has(name)) {
        if (this.debug > 1) console.warn(`No callbacks registered for "${name}"`)
        return
      }

      const callbacks = this.calls.get(name)
      if (!callbacks || callbacks.size === 0) {
        if (this.debug > 1) console.warn(`No callbacks registered for "${name}"`)
        return
      }

      if (!(callbacks instanceof Map)) {
        if (this.debug > 0) {
          console.error('Callback was not a map! Got ', typeof callbacks, 'instead.')
        }
        return
      }

      if (this.debug > 2) console.log(`Executing callbacks for "${name}"`)

      for (const callback of callbacks.values()) {
        if (callback === null || typeof callback !== 'function') {
          if (this.debug > 1) {
            console.warn(
              `Callback registered for "${name}" is null or not a function`
            )
          }
          continue
        }

        try {
          if (this.debug > 2) console.log(`Executing callback ${callback}`)
          callback(...args)
        } catch (error) {
          if (this.debug > 0) {
            console.error(`Error executing callback for "${name}"`, error)
          }
        }
      }
    }
  }

  class CloudLinkDelta_Core {
    constructor () {
      this.peer = null
      this.peerJsLoader = null
      this.name = ''
      this.dataConnections = new Map()
      this.newestConnected = ''
      this.lastDisconnected = ''
      this.lastPacket = {
        peer: '',
        channel: ''
      }
      this.lastGlobalPacket = {
        channel: '',
        origin: ''
      }
      this.lastPeerErrorInfo = ''
      this.peerStatus = 'idle'
      this.peerConnectTimeout = null
      this.outgoingConnectTimeoutMs = 10000
      this.verboseLogs = false
      this.maskedConnections = new Set()
      this.callbacks = new CallbackInator()
      this.plugins = new Array()
      this.remapper = new Map()
      this.taskQueue = new Map()
      this.pingPongEnabled = false
      this.pingPongInterval = 1000
      this.prettifier = null
      this.diagnostics = {
        guaranteedToWork: false,
        browser: '',
        dataCapable: false,
        reliableCapable: false,
        mediaCapable: false
      }
      // Allow plugins to use their own ID resolvers as key-value pairs
      this.idRemapper = null
      this.enableIdRemapper = false

      /**
       * A Map to register plugin handlers for specific opcodes.
       * Maps: opcode (string) -> handler (function)
       */
      this.opcodeHandlers = new Map()

      /**
       * A map of plugin-specific message handlers.
       * Plugins (like Sync, Discovery) will register themselves here.
       * @type {Object<string, function>}
       */
      this.onMessage = {}

      /**
       * Key is the channel label.
       * Value is an object containing the most recent value and the origin ID.
       * @type {Map<string, Object>}
       */
      this.gmsg_state = new Map()

      this.sessionServer = this._cloneSessionServer(SESSION_SERVER)
      this.sessionServerInput = SESSION_SERVER.host
    }

    // Internal functions that aren't mapped to blocks

    _cloneIceServer (server) {
      const cloned = { ...server }
      if (Array.isArray(cloned.urls)) {
        cloned.urls = [...cloned.urls]
      }
      return cloned
    }

    _cloneSessionServer (server) {
      return {
        ...server,
        config: {
          ...server.config,
          iceServers: (server.config?.iceServers || []).map(ice =>
            this._cloneIceServer(ice)
          )
        }
      }
    }

    _normalizePeerServerPath (path) {
      let normalized = String(path || '/').trim()

      if (!normalized.startsWith('/')) {
        normalized = '/' + normalized
      }

      normalized = normalized.replace(/\/+$/, '')

      if (normalized.toLowerCase().endsWith('/peerjs')) {
        normalized = normalized.slice(0, -7)
      }

      if (!normalized) {
        normalized = '/'
      }

      if (!normalized.endsWith('/')) {
        normalized += '/'
      }

      return normalized
    }

    _normalizeSessionServerInput (input) {
      const raw = Scratch.Cast.toString(input).trim()
      const baseServer = this._cloneSessionServer(this.sessionServer || SESSION_SERVER)

      if (!raw) {
        return baseServer
      }

      let candidate = raw
      if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
        candidate = 'https://' + candidate
      }

      let parsed
      try {
        parsed = new URL(candidate)
      } catch {
        throw new Error('Invalid session server IP/URL.')
      }

      const secure = parsed.protocol === 'https:' || parsed.protocol === 'wss:'
      const host = parsed.hostname
      const port = parsed.port
        ? parseInt(parsed.port, 10)
        : secure
          ? 443
          : 80

      if (!host) {
        throw new Error('Session server IP/URL must include a valid host.')
      }

      baseServer.host = host
      baseServer.port = Number.isFinite(port) && port > 0 ? port : secure ? 443 : 80
      baseServer.secure = secure
      baseServer.path = this._normalizePeerServerPath(parsed.pathname)

      return baseServer
    }

    _normalizeIceUrl (url, kind) {
      let value = Scratch.Cast.toString(url).trim()

      if (!value) {
        throw new Error(`${kind.toUpperCase()} URL cannot be empty.`)
      }

      if (!/^[a-z]+:/i.test(value)) {
        value = `${kind}:${value}`
      }

      if (kind === 'stun' && !/^stuns?:/i.test(value)) {
        throw new Error('STUN URL must begin with stun: or stuns:.')
      }

      if (kind === 'turn' && !/^turns?:/i.test(value)) {
        throw new Error('TURN URL must begin with turn: or turns:.')
      }

      return value
    }

    _syncPeerConfig () {
      if (this.peer && this.peer.options && this.peer.options.config) {
        this.peer.options.config.iceTransportPolicy =
          this.sessionServer.config.iceTransportPolicy
        this.peer.options.config.iceServers =
          this.sessionServer.config.iceServers.map(ice =>
            this._cloneIceServer(ice)
          )
      }
    }

    _configureSessionServer (input) {
      try {
        this.sessionServer = this._normalizeSessionServerInput(input)
        const raw = Scratch.Cast.toString(input).trim()
        this.sessionServerInput = raw || this.sessionServer.host
        this._syncPeerConfig()
        return true
      } catch (err) {
        this._recordPeerError(err)
        return false
      }
    }

    _addIceServer (url, kind, extra = {}) {
      try {
        const normalized = this._normalizeIceUrl(url, kind)
        const entry = {
          urls: normalized
        }

        if (extra && typeof extra === 'object') {
          if (extra.username !== undefined) {
            entry.username = extra.username
          }
          if (extra.credential !== undefined) {
            entry.credential = extra.credential
          }
        }

        const nextIceServers = this.sessionServer.config.iceServers.map(ice =>
          this._cloneIceServer(ice)
        )

        const alreadyExists = nextIceServers.some(server => {
          const urls = Array.isArray(server.urls) ? server.urls : [server.urls]
          const urlMatch = urls.some(existing => {
            return String(existing).toLowerCase() === normalized.toLowerCase()
          })

          if (!urlMatch) return false

          const existingUsername =
            server.username === undefined ? '' : String(server.username)
          const existingCredential =
            server.credential === undefined ? '' : String(server.credential)
          const nextUsername =
            entry.username === undefined ? '' : String(entry.username)
          const nextCredential =
            entry.credential === undefined ? '' : String(entry.credential)

          return (
            existingUsername === nextUsername &&
            existingCredential === nextCredential
          )
        })

        if (!alreadyExists) {
          nextIceServers.unshift(entry)
        }

        this.sessionServer.config.iceServers = nextIceServers
        this._syncPeerConfig()
      } catch (err) {
        this._recordPeerError(err)
      }
    }

    _getPeerConstructor () {
      if (typeof Peer !== 'undefined') return Peer

      if (typeof globalThis !== 'undefined') {
        if (globalThis.Peer) return globalThis.Peer
        if (globalThis.peerjs && globalThis.peerjs.Peer) {
          return globalThis.peerjs.Peer
        }
      }

      if (typeof window !== 'undefined') {
        if (window.Peer) return window.Peer
        if (window.peerjs && window.peerjs.Peer) {
          return window.peerjs.Peer
        }
      }

      if (typeof self !== 'undefined') {
        if (self.Peer) return self.Peer
        if (self.peerjs && self.peerjs.Peer) {
          return self.peerjs.Peer
        }
      }

      return null
    }

    _loadScript (src) {
      return new Promise((resolve, reject) => {
        if (typeof document === 'undefined') {
          reject(new Error('Document is unavailable, so PeerJS cannot be loaded.'))
          return
        }

        const mount =
          document.head || document.documentElement || document.body

        if (!mount) {
          reject(new Error('No document mount point was found for loading PeerJS.'))
          return
        }

        const existing = Array.from(document.querySelectorAll('script')).find(
          script => script.src === src
        )

        if (existing) {
          if (this._getPeerConstructor()) {
            resolve()
            return
          }

          const handleLoad = () => {
            existing.removeEventListener('load', handleLoad)
            existing.removeEventListener('error', handleError)
            resolve()
          }

          const handleError = () => {
            existing.removeEventListener('load', handleLoad)
            existing.removeEventListener('error', handleError)
            reject(new Error(`Failed to load PeerJS from ${src}`))
          }

          existing.addEventListener('load', handleLoad)
          existing.addEventListener('error', handleError)
          return
        }

        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.crossOrigin = 'anonymous'

        script.onload = () => resolve()
        script.onerror = () =>
          reject(new Error(`Failed to load PeerJS from ${src}`))

        mount.appendChild(script)
      })
    }

    async _ensurePeerJsLoaded () {
      const existingCtor = this._getPeerConstructor()
      if (existingCtor) return existingCtor

      if (this.peerJsLoader) return this.peerJsLoader

      this.peerJsLoader = (async () => {
        let lastError = null

        for (const src of PEERJS_SOURCES) {
          try {
            await this._loadScript(src)

            const PeerCtor = this._getPeerConstructor()
            if (PeerCtor) return PeerCtor

            lastError = new Error(
              `PeerJS script loaded from ${src}, but no Peer constructor was exposed.`
            )
          } catch (err) {
            lastError = err
          }
        }

        throw (
          lastError ||
          new Error('PeerJS could not be loaded from any configured source.')
        )
      })()

      try {
        return await this.peerJsLoader
      } catch (err) {
        this.peerJsLoader = null
        throw err
      }
    }

    /**
     * Converts a peer ID to a human-readable "pretty" format if a prettifier is registered.
     * @param {string} id The peer ID to format.
     * @returns {string} The formatted ID or the original ID.
     * @private
     */
    _prettyPeer (id) {
      if (this.prettifier) return this.prettifier(id)
      return id
    }

    _clearPeerConnectTimeout () {
      if (this.peerConnectTimeout) {
        clearTimeout(this.peerConnectTimeout)
        this.peerConnectTimeout = null
      }
    }

    _clearOutgoingConnectTimeout (conn) {
      if (conn && conn._cldeltaConnectTimeout) {
        clearTimeout(conn._cldeltaConnectTimeout)
        conn._cldeltaConnectTimeout = null
      }
    }

    _failOutgoingConnection (conn, message, error = null) {
      this._clearOutgoingConnectTimeout(conn)

      if (!conn) return
      if (conn.label !== 'default') return

      if (message) {
        this.lastPeerErrorInfo = message
        if (this.peer) this.peer.errorInfo = message
        console.error('[CLΔ Core] ' + message, error || '')
        Scratch.vm.runtime.startHats('cldeltacore_whenPeerHasError')
      }

      if (this.dataConnections.get(conn.peer) === conn && !conn.open) {
        this.dataConnections.delete(conn.peer)
      }

      try {
        if (!conn.open) conn.close()
      } catch {}
    }

    _recordPeerError (error) {
      const message =
        error && typeof error === 'object'
          ? error.message || error.type || String(error)
          : String(error)

      this.lastPeerErrorInfo = message

      if (this.peer) {
        this.peer.errorInfo = message
      }

      console.error('[CLΔ Core] Peer error:', error)
      Scratch.vm.runtime.startHats('cldeltacore_whenPeerHasError')
      return message
    }

    _resetConnectionState () {
      for (const tasks of this.taskQueue.values()) {
        clearInterval(tasks.pinger)
        clearInterval(tasks.poller)
      }
      this.taskQueue.clear()

      for (const conn of this.dataConnections.values()) {
        try {
          conn.close()
        } catch {}
      }

      this.dataConnections.clear()
      this.newestConnected = ''
      this.lastDisconnected = ''
      this.lastPacket = {
        peer: '',
        channel: ''
      }
      this.lastGlobalPacket = {
        channel: '',
        origin: ''
      }
      this.gmsg_state.clear()
    }

    /**
     * Registers a function from a plugin to format peer IDs for logging.
     * @param {object} plugin The plugin instance registering the function.
     * @param {function} func The function that takes an ID and returns a string.
     */
    registerPrettifier (plugin, func) {
      if (this.prettifier) {
        console.warn('[CLΔ Core] A prettifier is already registered. Overwriting.')
      }
      if (!plugin || typeof func !== 'function') {
        console.error(
          '[CLΔ Core] Prettifier registration failed: invalid plugin or function.'
        )
        return
      }
      this.prettifier = func
      console.log(
        `[CLΔ Core] Registered peer ID prettifier from plugin: ${plugin.id}`
      )
    }

    removePrettifier () {
      if (this.prettifier) {
        this.prettifier = null
        console.log('[CLΔ Core] Removed peer ID prettifier.')
      }
    }

    _sendOnChannel (conn, label, message) {
      const entry = this._getChan(conn, label)
      if (!entry || !entry.chan) return false

      const transport = entry.chan
      const isOpen =
        transport === conn ? !!conn.open : transport.readyState === 'open'

      if (!isOpen) return false

      try {
        transport.send(message)
        return true
      } catch (err) {
        console.warn(
          `[CLΔ Core] Failed to send on channel "${label}" with peer "${this._prettyPeer(conn.peer)}":`,
          err
        )
        return false
      }
    }

    /**
     * Internal "smart" send function.
     * All outgoing packets should be routed through here.
     * @param {object} packet - A packet object following the protocol schema.
     * @private
     */
    _send (packet) {
      if (!this.peer || !this.peer.open) return

      // Apply defaults and origin
      const fullPacket = {
        origin: this.peer.id,
        ttl: 1,
        target: '*', // Default to broadcast
        channel: 'default',
        ...packet // The packet from the block will overwrite defaults
      }

      const message = JSON.stringify(fullPacket)
      const { target, channel } = fullPacket

      if (target === '*') {
        // --- Broadcast to all peers ---
        for (const conn of this.dataConnections.values()) {
          
          // Do not transmit a broadcast event if the connection is masked
          if (this.maskedConnections.has(conn.peer)) continue
          
          if (!conn.channels || !conn.channels.has(channel)) continue
          this._sendOnChannel(conn, channel, message)
        }
        return
      }

      const conn = this.dataConnections.get(target)
      if (!conn) {
        console.warn(
          `[CLΔ Core] Cannot send packet: Not connected to peer "${target}".`
        )
        return
      }

      if (!conn.channels || !conn.channels.has(channel)) {
        console.warn(
          `[CLΔ Core] Cannot send packet: Channel "${channel}" not open with peer "${target}".`
        )
        return
      }

      if (!this._sendOnChannel(conn, channel, message)) {
        console.warn(
          `[CLΔ Core] Cannot send packet: Channel "${channel}" with peer "${target}" is not ready.`
        )
      }
    }

    /**
     * Runs diagnostics to determine the capabilities of the browser.
     * @returns {object} Object containing the results of the diagnostics.
     * @property {boolean} guaranteedToWork Whether the extension is guaranteed to work in the current browser.
     * @property {string} browser The type of browser being used.
     * @property {boolean} dataCapable Whether the browser supports data channels.
     * @property {boolean} reliableCapable Whether the browser supports reliable data channels.
     * @property {boolean} mediaCapable Whether the browser supports media capture.
     */
    _runDiagnostics () {
      this.diagnostics.guaranteedToWork = false

      const browser = () => {
        if (typeof navigator === 'undefined' || !navigator.userAgent) {
          return 'Not a browser'
        }

        const ua = navigator.userAgent.toLowerCase()

        if (ua.includes('firefox')) return 'firefox'
        if (ua.includes('edg/') || ua.includes('edge')) return 'edge'
        if (ua.includes('chrome') && !ua.includes('edg/') && !ua.includes('opr/')) {
          return 'chrome'
        }
        if (ua.includes('safari') && !ua.includes('chrome')) return 'safari'

        // If browser is unknown, check WebRTC compatibility
        const hasWebRTC =
          typeof RTCPeerConnection !== 'undefined' ||
          typeof webkitRTCPeerConnection !== 'undefined' ||
          typeof mozRTCPeerConnection !== 'undefined'

        return hasWebRTC
          ? 'Supported but unknown browser'
          : 'Not a supported browser'
      }

      const dataCapable = () => {
        try {
          const pc = new RTCPeerConnection()
          const dc = pc.createDataChannel('test')
          pc.close()
          return !!dc
        } catch {
          return false
        }
      }

      const reliableCapable = () => {
        if (typeof RTCPeerConnection === 'undefined') return false

        try {
          const pc = new RTCPeerConnection()
          const dc = pc.createDataChannel('test', { reliable: true })
          const supported = 'ordered' in dc
          dc.close()
          pc.close()
          return supported
        } catch {
          return false
        }
      }

      const mediaCapable = () => {
        if (typeof navigator === 'undefined') return false
        if (navigator.mediaDevices?.getUserMedia) return true
        return !!(
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia
        )
      }

      this.diagnostics.browser = browser()
      this.diagnostics.dataCapable = dataCapable()
      this.diagnostics.reliableCapable = reliableCapable()
      this.diagnostics.mediaCapable = mediaCapable()

      if (
        this.diagnostics.browser !== 'Not a supported browser' &&
        this.diagnostics.dataCapable &&
        this.diagnostics.reliableCapable &&
        this.diagnostics.mediaCapable
      )
        this.diagnostics.guaranteedToWork = true
    }

    /**
     * Maps a key to a function that will be called when the corresponding block
     * is invoked. If a function is already mapped to the key, it will
     * be replaced with the new one. Intended for use with plugins.
     *
     * @param {string} key - The key of the block to be remapped.
     * @param {function} func - The function to be called when the block is invoked.
     */
    _remap (key, func) {
      this.remapper.set(key, func)
    }

    /**
     * Checks if a key is already mapped to a function in the remapper.
     * @param {string} key - The key to check for.
     * @returns {boolean} - True if the key is mapped, false otherwise.
     */
    _isRemapped (key) {
      return this.remapper.has(key)
    }

    /**
     * Calls a function remapped to a key if it exists in the remapper.
     * If the key is not mapped, it does nothing.
     * @param {string} key - The key of the function to be called.
     * @param {...any} args - The arguments to be passed to the remapped function.
     * @returns {any} - The return value of the remapped function if it exists, undefined otherwise.
     */
    _callRemapped (key, ...args) {
      if (!this.remapper.has(key)) return undefined
      return this.remapper.get(key)(...args)
    }

    /**
     * Deletes a key from the remapper if it exists.
     * If the key is not mapped, it does nothing.
     * @param {string} key - The key to be deleted from the remapper.
     * @returns {void}
     */
    _unmap (key) {
      this.remapper.delete(key)
    }

    /**
     * Handles a channel open event by adding the channel to the connection's
     * channel map and setting its data to an empty string.
     * @param {Object} conn - The connection object.
     * @param {Object} chan - The channel object.
     */
    _handleChannelOpen (conn, chan) {
      this._ensureConnProperties(conn)
      this._ensureChanProperties(conn, chan.label, chan)
    }

    /**
     * Handles a channel close event by deleting the channel from the connection's channel map.
     * @param {Object} conn - The connection object.
     * @param {Object} chan - The channel object.
     */
    _handleChannelClose (conn, chan) {
      if (conn.channels) {
        conn.channels.delete(chan.label)
      }
    }

    /**
     * Handles a channel error event by logging the error and setting the peer's error info to the error.
     * @param {Object} conn - The connection object.
     * @param {Object} chan - The channel object.
     * @param {Error} err - The error that occurred.
     */
    _handleChannelError (conn, chan, err) {
      console.warn(
        'Channel ' +
          chan.label +
          ' error with peer ' +
          this._prettyPeer(conn.peer) +
          ':',
        err
      )
      this._recordPeerError(err)
    }

    _ensureDefaultChannel (conn) {
      if (!conn.channels) conn.channels = new Map()
      if (!conn.channels.has('default')) {
        this._ensureChanProperties(conn, 'default', conn)
      }
    }

    /**
     * Ensures that a connection object has all the required properties.
     * If any of the properties are missing, they are set to their default values.
     * This function is called every time a new connection is established.
     * @param {Object} conn - The connection object to be validated.
     */
    _ensureConnProperties (conn) {
      if (!conn.features) conn.features = new Array()
      if (typeof conn.idCounter !== 'number') conn.idCounter = 2
      if (!conn.channels) conn.channels = new Map()
      if (typeof conn.rtt !== 'number') conn.rtt = 0
      if (typeof conn.clockOffset !== 'number') conn.clockOffset = 0
      if (typeof conn.outgoingBitrate !== 'number') conn.outgoingBitrate = 0
      if (typeof conn.incomingBitrate !== 'number') conn.incomingBitrate = 0
      if (typeof conn.lastRecvBytes !== 'number') conn.lastRecvBytes = 0
      if (typeof conn.lastSendBytes !== 'number') conn.lastSendBytes = 0
      if (typeof conn.totalRecvBytes !== 'number') conn.totalRecvBytes = 0
      if (typeof conn.totalSendBytes !== 'number') conn.totalSendBytes = 0
      if (typeof conn.openTime !== 'number') conn.openTime = Date.now()
    }

    _ensureChanProperties (conn, label, chan) {
      if (!conn.channels) conn.channels = new Map()

      if (!conn.channels.has(label)) {
        conn.channels.set(label, {
          chan: chan || null,
          data: ''
        })
      }

      const entry = conn.channels.get(label)
      if (typeof entry.data === 'undefined') entry.data = ''
      if (chan) entry.chan = chan
    }

    /**
     * Returns a channel object from a connection object by label.
     * If the channel object does not exist, it will be created and added to the connection object.
     * @param {Object} conn - The connection object.
     * @param {string} label - The label of the channel to be retrieved.
     * @returns {Object|null} The channel object if it exists, null otherwise.
     */
    _getChan (conn, label) {
      if (!conn.channels || !conn.channels.has(label)) return null
      const entry = conn.channels.get(label)
      this._ensureChanProperties(conn, label, entry.chan)
      return conn.channels.get(label)
    }

    /**
     * Checks if a peer with the given ID is stored in the data connections map.
     * @param {string} id - The ID of the peer to check for.
     * @returns {boolean} True if the peer is stored, false otherwise.
     */
    _isOtherPeerStored (id) {
      if (!this.peer) return false
      return this.dataConnections.has(id)
    }

    /**
     * Checks if a peer with the given ID is stored in the data connections map.
     * @param {string} id - The ID of the peer to check for.
     * @returns {boolean} True if the peer is stored, false otherwise.
     */
    _isOtherPeerConnected (id) {
      return this._isOtherPeerStored(id)
        ? this.dataConnections.get(id).open
        : false
    }

    /**
     * Handles a data connection event by adding event listeners for the "open", "close", "error", and "data" events.
     * The "open" event is handled by ensuring that the connection has a default channel and sending the negate packet.
     * The "close" event is handled by removing the default channel from the connection's channel map.
     * The "error" event is handled by logging the error and setting the peer's error info to the error.
     * The "data" event is handled by reading the data from the channel and forwarding it to the channel's data handler.
     * @param {Object} conn - The connection object.
     */
    _handleDataConnection (conn) {
      conn.on('open', () => {
        this._clearOutgoingConnectTimeout(conn)
        this._ensureConnProperties(conn)
        this._ensureDefaultChannel(conn)

        const defaultChanEntry = this._getChan(conn, 'default')
        if (!defaultChanEntry) return
        const defaultchan = defaultChanEntry.chan

        this._handleChannelOpen(conn, defaultchan)

        this._sendOnChannel(
          conn,
          'default',
          JSON.stringify({
            opcode: 'NEGOTIATE',
            ttl: 1,
            payload: {
              plugins: this.plugins,
              version: EXTENSION_VERSION,
              spec_version: DIALECT_REVISION,
              is_relay: false,
              is_bridge: false,
              is_discovery: false
            }
          })
        )

        if (conn.label === 'default') {
          console.log(
            '[CLΔ Core] Peer ' + this._prettyPeer(conn.peer) + ' connected.'
          )
          this.newestConnected = conn.peer
          Scratch.vm.runtime.startHats('cldeltacore_whenPeerConnects')
          Scratch.vm.runtime.startHats('cldeltacore_whenSpecificPeerConnects')
        } else {
          console.warn(
            '[CLΔ Core] Peer ' +
              this._prettyPeer(conn.peer) +
              ' connected, but is using a non-default channel.'
          )
        }

        this.callbacks.call('peer_connect', conn)

        const ping = () => {
          this._sendOnChannel(
            conn,
            'default',
            JSON.stringify({
              opcode: 'PING',
              payload: {
                t1: Date.now()
              },
              ttl: 1
            })
          )
        }

        const handleStats = async () => {
          try {
            if (
              !conn.peerConnection ||
              typeof conn.peerConnection.getStats !== 'function'
            ) {
              return
            }

            const stats = await conn.peerConnection.getStats()
            const { _lastTime, lastSendBytes, lastRecvBytes } = conn

            const totalBytes = Array.from(stats.values()).reduce(
              (acc, report) => {
                if (report.type === 'data-channel') {
                  return {
                    sendBytes: acc.sendBytes + (report.bytesSent || 0),
                    recvBytes: acc.recvBytes + (report.bytesReceived || 0)
                  }
                }
                return acc
              },
              { sendBytes: 0, recvBytes: 0 }
            )

            const currentSendBytes = totalBytes.sendBytes
            const currentRecvBytes = totalBytes.recvBytes

            const now = performance.now()
            if (_lastTime) {
              const deltaTime = (now - _lastTime) / 1000
              conn.outgoingBitrate =
                deltaTime > 0 ? (currentSendBytes - lastSendBytes) / deltaTime : 0
              conn.incomingBitrate =
                deltaTime > 0 ? (currentRecvBytes - lastRecvBytes) / deltaTime : 0
            }

            conn.lastRecvBytes = currentRecvBytes
            conn.lastSendBytes = currentSendBytes
            conn.totalRecvBytes = currentRecvBytes
            conn.totalSendBytes = currentSendBytes
            conn._lastTime = now
          } catch (error) {
            console.error('[CLΔ Core] Error getting stats:', error)
          }
        }

        if (this.pingPongEnabled) {
          this.taskQueue.set(conn.peer, {
            pinger: setInterval(() => ping(), this.pingPongInterval),
            poller: setInterval(() => {
              void handleStats()
            }, 1000)
          })
        } else {
          this.taskQueue.set(conn.peer, {
            pinger: 0,
            poller: setInterval(() => {
              void handleStats()
            }, 1000)
          })
        }
      })

      conn.on('close', () => {
        this._clearOutgoingConnectTimeout(conn)

        if (conn.channels && conn.channels.has('default')) {
          const entry = this._getChan(conn, 'default')
          if (entry) this._handleChannelClose(conn, entry.chan)
        } else {
          this._handleChannelClose(conn, conn)
        }

        if (conn.label === 'default') {
          this.lastDisconnected = conn.peer
          this.dataConnections.delete(conn.peer)

          const tasks = this.taskQueue.get(conn.peer)
          if (tasks) {
            clearInterval(tasks.pinger)
            clearInterval(tasks.poller)
          }
          this.taskQueue.delete(conn.peer)

          console.log(
            `[CLΔ Core] Peer ${this._prettyPeer(conn.peer)} disconnected.`
          )
          Scratch.vm.runtime.startHats('cldeltacore_whenPeerDisconnects')
          Scratch.vm.runtime.startHats(
            'cldeltacore_whenSpecificPeerDisconnects'
          )
        }

        this.callbacks.call('peer_disconnect', conn)
      })

      conn.on('error', err => {
        this._clearOutgoingConnectTimeout(conn)

        if (conn.label === 'default' && !conn.open) {
          this.dataConnections.delete(conn.peer)
        }

        this._handleChannelError(conn, conn, err)
      })

      conn.on('data', async msg => {
        this._ensureConnProperties(conn)
        this._ensureDefaultChannel(conn)

        const defaultChanEntry = this._getChan(conn, 'default')
        if (!defaultChanEntry) return

        await this._dataChanStreamReader(conn, defaultChanEntry.chan, msg)
      })
    }

    /**
     * Handles a channel data event and processes the data based on the opcode.
     * @param {Object} conn - The connection object.
     * @param {Object} chan - The channel object.
     * @param {Object} data - The data object containing the opcode and payload.
     */
    async _handleChannelData (conn, chan, data) {
      // We parse the whole packet
      const { opcode, payload, origin, ttl, listener } = data

      // 1. TTL Check
      if (ttl === undefined || ttl < 0) return

      // 2. Plugin Opcode Dispatcher
      // Check if a plugin (like Sync or Discovery) has registered this opcode
      if (this.opcodeHandlers.has(opcode)) {
        try {

          // Found a plugin handler, forward the entire packet
          const { handler, requiredFeature } = this.opcodeHandlers.get(opcode)

          // Allow if no required feature or peer has it
          if (!requiredFeature || conn.features.includes(requiredFeature)) {
            await handler(data, conn.peer)
          } else {
            console.error(
              `[CLΔ Core] Plugin handler for opcode "${opcode}" requires advertised feature "${requiredFeature}", but peer does not have it.`
            )
          }
        } catch (e) {
          console.error(
            `[CLΔ Core] Error in plugin handler for opcode "${opcode}":`,
            e
          )
        }
        return // Plugin handled it
      }

      // 3. Core Opcode Handler
      // These are opcodes the Core handles itself
      switch (opcode) {
        case 'WARNING':
          alert(payload)
          break

        case 'VIOLATION':
          alert(payload)
          this.destroyPeer()
          break

        case 'G_MSG':
          this.gmsg_state.set(chan.label, {
            value: payload,
            origin: origin || conn.peer
          })
          this.lastGlobalPacket = {
            channel: chan.label,
            origin: origin || conn.peer
          }
          Scratch.vm.runtime.startHats('cldeltacore_whenPeerGetsGlobalPacket')
          break

        case 'P_MSG':
          this._ensureChanProperties(conn, chan.label, chan)
          conn.channels.get(chan.label).data = payload
          this.lastPacket = {
            peer: conn.peer,
            channel: chan.label
          }
          Scratch.vm.runtime.startHats('cldeltacore_whenPeerGetsPacket')
          break

        case 'PING':
          if (chan.label !== 'default') {
            console.warn(
              '[CLΔ Core] Attempted to call PING on non-default channel ' +
                chan.label +
                ' with peer ' +
                this._prettyPeer(conn.peer)
            )
            return
          }

          chan.send(
            JSON.stringify({
              opcode: 'PONG',
              payload: {
                t1: payload.t1,
                t2: Date.now()
              },
              listener,
              ttl: 1
            })
          )
          break

        case 'PONG': {
          if (chan.label !== 'default') {
            console.warn(
              '[CLΔ Core] Attempted to call PONG on non-default channel ' +
                chan.label +
                ' with peer ' +
                this._prettyPeer(conn.peer)
            )
            return
          }

          const t3 = Date.now()
          const { t1, t2 } = payload
          conn.rtt = t3 - t1
          conn.clockOffset = (t2 - t1 + (t2 - t3)) / 2
          break
        }

        case 'NEGOTIATE': {
          if (chan.label !== 'default') {
            console.warn(
              '[CLΔ Core] Attempted to call NEGOTIATE on non-default channel ' +
                chan.label +
                ' with peer ' +
                this._prettyPeer(conn.peer)
            )
            return
          }

          console.log(
            '[CLΔ Core] Peer ' +
              this._prettyPeer(conn.peer) +
              ' is using dialect revision ' +
              payload.spec_version +
              ' on ' +
              payload.version.type +
              ' (v' +
              payload.version.major +
              '.' +
              payload.version.minor +
              '.' +
              payload.version.patch +
              ')'
          )

          if (Array.isArray(payload.plugins) && payload.plugins.length > 0) {
            console.log(
              '[CLΔ Core] Peer ' +
                this._prettyPeer(conn.peer) +
                ' advertises the following plugins: ' +
                payload.plugins.join(', ')
            )
          }

          const advertisedFeatures = new Set()

          if (payload.is_bridge) advertisedFeatures.add('bridge')
          if (payload.is_relay) advertisedFeatures.add('relay')
          if (payload.is_discovery) advertisedFeatures.add('discovery')

          if (advertisedFeatures.size > 0) {
            console.log(
              '[CLΔ Core] Peer ' +
                this._prettyPeer(conn.peer) +
                ' advertises the following features: ' +
                Array.from(advertisedFeatures).join(', ')
            )
          }

          conn.features = Array.from(advertisedFeatures)
          this.callbacks.call('peer_negotiated', conn)
          break
        }

        case 'NEW_CHAN': {
          if (chan.label !== 'default') {
            console.warn(
              'Attempted to call NEW_CHAN on non-default channel ' +
                chan.label +
                ' with peer ' +
                this._prettyPeer(conn.peer)
            )
            return
          }

          const { id, label, ordered } = payload
          if (conn.channels.has(label)) return

          const lockId = 'cldeltacore_' + conn.peer + '_' + label
          await navigator.locks.request(lockId, async () => {
            if (conn.channels.has(label)) return

            this._ensureConnProperties(conn)

            const newchan = conn.peerConnection.createDataChannel(label, {
              ordered: ordered,
              negotiated: true,
              id: id
            })

            conn.idCounter = Math.max(conn.idCounter, id + 1)
            this._chanMethodBinder(conn, newchan)
            this._ensureChanProperties(conn, label, newchan)
          })
          break
        }

        default:
          console.warn('Unknown or unimplemented opcode: ' + opcode)
          break
      }
    }

    _chanMethodBinder (conn, chan) {
      chan.onopen = () => {
        this._ensureConnProperties(conn)
        this._handleChannelOpen(conn, chan)
      }

      chan.onclose = () => {
        this._handleChannelClose(conn, chan)
      }

      chan.onerror = err => {
        this._handleChannelError(conn, chan, err)
      }

      chan.onmessage = async event => {
        await this._dataChanStreamReader(conn, chan, event?.data ?? event)
      }
    }

    async _dataChanStreamReader (conn, chan, raw) {
      let data = raw

      if (typeof MessageEvent !== 'undefined' && data instanceof MessageEvent) {
        data = data.data
      }

      if (data == null) return

      if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
        data = new TextDecoder().decode(data)
      } else if (
        typeof ArrayBuffer !== 'undefined' &&
        ArrayBuffer.isView &&
        ArrayBuffer.isView(data)
      ) {
        data = new TextDecoder().decode(
          new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
        )
      } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
        data = await data.text()
      }

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (err) {
          console.error(
            `[CLΔ Core] Failed to parse packet on channel "${chan.label}" from ${this._prettyPeer(conn.peer)}:`,
            err,
            data
          )
          return
        }
      }

      if (!data || typeof data !== 'object') {
        console.error(
          `[CLΔ Core] Unsupported packet type on channel "${chan.label}":`,
          data
        )
        return
      }

      this._ensureConnProperties(conn)
      this._ensureChanProperties(conn, chan.label, chan)
      await this._handleChannelData(conn, chan, data)
    }

    async _spawnPeer (id) {
      let PeerCtor

      try {
        PeerCtor = await this._ensurePeerJsLoaded()
      } catch (err) {
        this._recordPeerError(err)
        return
      }

      this._clearPeerConnectTimeout()
      this._resetConnectionState()

      if (this.peer && !this.peer.destroyed) {
        try {
          this.peer.destroy()
        } catch {}
      }

      this.peerStatus = 'connecting'

      const activeServer = this._cloneSessionServer(this.sessionServer || SESSION_SERVER)

      const peerInstance = new PeerCtor(id, {
        host: activeServer.host,
        port: activeServer.port,
        secure: activeServer.secure,
        path: activeServer.path,
        key: activeServer.key,
        config: activeServer.config,
        debug: this.verboseLogs ? 3 : 2,
        metadata: {
          protocol: 'delta',
          id: id
        }
      })

      this.peer = peerInstance
      this.peer.errorInfo = ''
      this.lastPeerErrorInfo = ''
      this.name = id

      this.peerConnectTimeout = setTimeout(() => {
        if (this.peer !== peerInstance || peerInstance.open) return

        const message =
          `Timed out connecting to session server "${activeServer.host}${activeServer.path}" as "${id}". ` +
          'Check the PeerServer host/path or try again.'

        this.lastPeerErrorInfo = message
        peerInstance.errorInfo = message
        console.error('[CLΔ Core] ' + message)
        Scratch.vm.runtime.startHats('cldeltacore_whenPeerHasError')

        try {
          if (!peerInstance.destroyed) peerInstance.destroy()
        } catch {}

        if (this.peer === peerInstance) {
          this.peer = null
          this.peerStatus = 'error'
        }
      }, activeServer.connectTimeoutMs)

      peerInstance.on('open', openedId => {
        if (this.peer !== peerInstance) return
        this._clearPeerConnectTimeout()
        this.peerStatus = 'open'
        this.name = openedId
        Scratch.vm.runtime.startHats('cldeltacore_whenPeerCreated')
        this.callbacks.call('peer_open', openedId)
      })

      peerInstance.on('connection', conn => {
        if (this.peer !== peerInstance) return

        const metadata = conn.metadata || {}

        if (!conn.metadata) {
          console.warn(
            'Peer ' +
              this._prettyPeer(conn.peer) +
              ' did not set their metadata!!!'
          )
        }

        if (metadata.protocol !== 'delta') {
          console.warn(
            'Peer ' +
              this._prettyPeer(conn.peer) +
              " did not passthrough the 'delta' protocol in their metadata!!!"
          )
        }

        this._ensureConnProperties(conn)
        this._ensureDefaultChannel(conn)
        this.dataConnections.set(conn.peer, conn)
        this._handleDataConnection(conn)
      })

      peerInstance.on('call', async call => {
        if (this.peer !== peerInstance) return
        this.callbacks.call('peer_call', call)
      })

      peerInstance.on('close', () => {
        this._clearPeerConnectTimeout()
        if (this.peer === peerInstance) {
          this.peerStatus = 'closed'
        }
        Scratch.vm.runtime.startHats('cldeltacore_whenPeerDestroyed')
      })

      peerInstance.on('disconnected', () => {
        this._clearPeerConnectTimeout()
        if (this.peer === peerInstance) {
          this.peerStatus = 'disconnected'
        }
        Scratch.vm.runtime.startHats('cldeltacore_whenPeerDisconnected')
      })

      peerInstance.on('error', err => {
        this._clearPeerConnectTimeout()
        this.lastPeerErrorInfo = err?.message || err?.type || String(err)
        peerInstance.errorInfo = this.lastPeerErrorInfo
        console.error('[CLΔ Core] Peer error:', err)
        Scratch.vm.runtime.startHats('cldeltacore_whenPeerHasError')

        if (!peerInstance.open && !peerInstance.destroyed) {
          try {
            peerInstance.destroy()
          } catch {}
        }

        if (this.peer === peerInstance && !peerInstance.open) {
          this.peer = null
          this.peerStatus = 'error'
        }
      })
    }

    async _createPeer (id) {
      if (this._isRemapped('createPeer')) {
        return this._callRemapped('createPeer', id)
      }

      if (this.peer) {
        if (this.peer.open && this.peer.id === id) return
        try {
          if (!this.peer.destroyed) this.peer.destroy()
        } catch {}
        this.peer = null
      }

      return this._spawnPeer(id)
    }

    resolvePeerId (id) {
      if (this.enableIdRemapper && this.idRemapper) {
        const resolved = this.idRemapper().get(id)
        return resolved || id
      }
      return id
    }

    registerMapper (plugin) {
      if (this.enableIdRemapper) return

      if (!plugin || typeof plugin.mapper !== 'function') {
        console.warn(
          '[CLΔ Core] Mapper failed to register: plugin must have a mapper() method.'
        )
        return
      }

      this.enableIdRemapper = true
      this.idRemapper = plugin.mapper
      console.log(`[CLΔ Core] Using ID remapper from plugin: ${plugin.id}`)
    }

    removeMapper () {
      if (this.enableIdRemapper) {
        this.enableIdRemapper = false
        this.idRemapper = null
      }
    }

    registerPlugin (plugin) {
      if (!plugin || typeof plugin.getOpcodes !== 'function') {
        console.warn(
          '[CLΔ Core] Plugin failed to register: must have a getOpcodes method.',
          plugin
        )
        return
      }

      if (plugin.id && !this.plugins.includes(plugin.id)) {
        this.plugins.push(plugin.id)
      }

      const handlers = plugin.getOpcodes(this)

      for (const [opcode, value] of handlers.entries()) {
        if (this.opcodeHandlers.has(opcode)) {
          console.warn(
            `[CLΔ Core] Opcode "${opcode}" is already registered! Overwriting.`
          )
        }

        let handler
        let requiredFeature

        if (typeof value === 'function') {
          handler = value
          requiredFeature = plugin.requiredFeature
        } else if (
          typeof value === 'object' &&
          value !== null &&
          typeof value.handler === 'function'
        ) {
          handler = value.handler
          requiredFeature = value.requiredFeature
        } else {
          console.error(
            `[CLΔ Core] Invalid handler for opcode "${opcode}" from plugin ${plugin.id}`
          )
          continue
        }

        this.opcodeHandlers.set(opcode, {
          handler: handler.bind(plugin),
          requiredFeature: requiredFeature
        })
      }

      console.log(
        `[CLΔ Core] Registered ${handlers.size} opcodes for plugin: ${plugin.id}`
      )
    }

    getInfo () {
      return {
        id: 'cldeltacore',
        name: 'CLΔ Core',
        menuIconURI: menuIcon,
        blockIconURI: blockIcon,
        color1: '#0F7EBD',
        blocks: [
          opcodes.label(
            'Extension v' +
              EXTENSION_VERSION.major +
              '.' +
              EXTENSION_VERSION.minor +
              '.' +
              EXTENSION_VERSION.patch
          ),
          opcodes.label('Dialect revision ' + DIALECT_REVISION),
          opcodes.separator(),

          opcodes.label('Diagnostics'),
          opcodes.reporter('currentBrowser', 'my current web browser'),
          opcodes.boolean(
            'isGuaranteedToWork',
            'is my browser guaranteed to work with this extension?'
          ),
          opcodes.boolean(
            'isDataCapable',
            'does my browser support DataChannels?'
          ),
          opcodes.boolean(
            'isReliableCapable',
            'does my browser support reliable DataChannels?'
          ),
          opcodes.boolean(
            'isMediaCapable',
            'does my browser support MediaStreams?'
          ),
          opcodes.separator(),

          opcodes.label('Configuration'),
          opcodes.command(
            'toggleVerboseLogs',
            '[TOGGLE] verbose browser console logs',
            {
              TOGGLE: args.string('disable', { menu: 'toggler' })
            }
          ),
          opcodes.command(
            'enablePingPong',
            '[TOGGLE] ping/pong',
            {
              TOGGLE: args.string('disable', { menu: 'toggler' })
            }
          ),
          opcodes.command(
            'setPingPongInterval',
            'set ping/pong interval to [DELAY] ms',
            {
              DELAY: args.number(500)
            }
          ),
          opcodes.command(
            'useStun',
            'Use STUN (stun url) [URL]',
            {
              URL: args.string('stun:vpn.mikedev101.cc:5349')
            }
          ),
          opcodes.command(
            'useTurn',
            'Use TURN (url) [URL] username (user) [USER] credential (cred) [CRED]',
            {
              URL: args.string('turn:vpn.mikedev101.cc:5349'),
              USER: args.string('free'),
              CRED: args.string('free')
            }
          ),
          opcodes.command(
            'useSessionServer',
            'Use Session Server [URL]',
            {
              URL: args.string('peerjs.mikedev101.cc')
            }
          ),
          opcodes.separator(),

          opcodes.label('Client state'),
          opcodes.event('whenPeerCreated', 'when my peer is created'),
          opcodes.event('whenPeerDestroyed', 'when my peer is destroyed'),
          opcodes.event('whenPeerDisconnected', 'when my peer is disconnected'),
          opcodes.event('whenPeerHasError', 'when my peer has an error'),
          opcodes.reporter('readPeerErrorInfo', 'error info'),
          opcodes.boolean('isPeerConnected', 'connected to session server?'),
          opcodes.separator(),

          opcodes.label('Connectivity'),
          opcodes.command(
            'createPeer',
            'Connect as (username) [USERNAME]',
            {
              USERNAME: args.string('A')
            }
          ),
          opcodes.command('disconnectPeer', 'disconnect from session server'),
          opcodes.command('reconnectPeer', 'reconnect to session server'),
          opcodes.command('destroyPeer', 'destroy session server connection'),
          opcodes.separator(),

          opcodes.label('Peers'),
          opcodes.event('whenPeerConnects', 'when a peer connects'),
          opcodes.reporter('readNewestPeerConnected', 'newest peer connected'),
          opcodes.event('whenPeerDisconnects', 'when a peer disconnects'),
          opcodes.reporter(
            'readLastPeerDisconnected',
            'last peer disconnected'
          ),
          opcodes.event('whenSpecificPeerConnects', 'when peer [ID] connects', {
            arguments: {
              ID: args.string('B')
            }
          }),
          opcodes.event(
            'whenSpecificPeerDisconnects',
            'when peer [ID] disconnects',
            {
              arguments: {
                ID: args.string('B')
              }
            }
          ),
          opcodes.command('connectToPeer', 'connect to [ID]', {
            ID: args.string('B')
          }),
          opcodes.command('disconnectFromPeer', 'disconnect from [ID]', {
            ID: args.string('B')
          }),
          opcodes.boolean('isOtherPeerConnected', 'connected to [ID]?', {
            ID: args.string('B')
          }),
          opcodes.separator(),

          opcodes.label('Channels'),
          opcodes.boolean(
            'doesPeerHaveChannel',
            'does [ID] have channel [CHANNEL]?',
            {
              ID: args.string('B'),
              CHANNEL: args.string('foobar')
            }
          ),
          opcodes.command(
            'openNewPeerChannel',
            'open channel [CHANNEL] with peer [ID] reliable? [ORDERED]',
            {
              ID: args.string('B'),
              CHANNEL: args.string('foobar'),
              ORDERED: args.boolean(true)
            }
          ),
          opcodes.command(
            'closePeerChannel',
            'close channel [CHANNEL] with peer [ID]',
            {
              ID: args.string('B'),
              CHANNEL: args.string('foobar')
            }
          ),
          opcodes.command(
            'storePeerChannels',
            'store a list of all open channels with peer [ID] in list [LIST]',
            {
              ID: args.string('B'),
              LIST: args.string('my list')
            }
          ),
          opcodes.separator(),

          opcodes.label('Packets'),
          opcodes.event(
            'whenPeerGetsGlobalPacket',
            'when I get a broadcast packet in channel [CHANNEL]',
            {
              arguments: {
                CHANNEL: args.string('default')
              }
            }
          ),
          opcodes.reporter(
            'readGlobalPacketData',
            'global packet in channel [CHANNEL]',
            {
              CHANNEL: args.string('default')
            }
          ),
          opcodes.reporter(
            'readGlobalPacketOrigin',
            'origin of global packet in channel [CHANNEL]',
            {
              CHANNEL: args.string('default')
            }
          ),
          opcodes.event(
            'whenPeerGetsPacket',
            'when I get a packet from peer [ID] in channel [CHANNEL]',
            {
              arguments: {
                ID: args.string('B'),
                CHANNEL: args.string('default')
              }
            }
          ),
          opcodes.reporter(
            'readPacketFromPeer',
            'packet from peer [ID] in channel [CHANNEL]',
            {
              ID: args.string('B'),
              CHANNEL: args.string('default')
            }
          ),
          opcodes.command(
            'sendMessageToPeer',
            'send [MESSAGE] to peer [ID] using channel [CHANNEL]',
            {
              MESSAGE: args.string('hello world'),
              ID: args.string('B'),
              CHANNEL: args.string('default')
            }
          ),
          opcodes.command(
            'sendMessageToAllPeers',
            'send [MESSAGE] everyone using channel [CHANNEL]',
            {
              MESSAGE: args.string('hello world'),
              CHANNEL: args.string('default')
            }
          ),
        ],
        menus: {
          toggler: {
            items: [Scratch.translate('disable'), Scratch.translate('enable')]
          },
          statsMode: {
            items: [
              Scratch.translate('transmit speed (bytes/s)'),
              Scratch.translate('receive speed (bytes/s)'),
              Scratch.translate('total sent (bytes)'),
              Scratch.translate('total received (bytes)'),
              Scratch.translate('connection duration (s)'),
              Scratch.translate('ping round-trip time (ms)'),
              Scratch.translate('ping offset (ms)')
            ]
          }
        }
      }
    }

    currentBrowser () {
      return this.diagnostics.browser
    }

    isGuaranteedToWork () {
      return this.diagnostics.guaranteedToWork
    }

    isDataCapable () {
      return this.diagnostics.dataCapable
    }

    isReliableCapable () {
      return this.diagnostics.reliableCapable
    }

    isMediaCapable () {
      return this.diagnostics.mediaCapable
    }

    toggleVerboseLogs ({ TOGGLE }) {
      this.verboseLogs = Scratch.Cast.toString(TOGGLE) === 'enable'
    }

    enablePingPong({ ENABLE }) {
      this.pingPongEnabled = Scratch.Cast.toBoolean(ENABLE)
    }

    setPingPongInterval ({ DELAY }) {
      const delay = Scratch.Cast.toNumber(DELAY)
      this.pingPongInterval = delay <= 100 ? 100 : delay
    }

    useStun ({ URL }) {
      this._addIceServer(URL, 'stun')
    }

    useTurn ({ URL, USER, CRED }) {
      const username = Scratch.Cast.toString(USER).trim()
      const credential = Scratch.Cast.toString(CRED).trim()

      this._addIceServer(URL, 'turn', {
        username,
        credential
      })
    }

    useSessionServer (args) {
      const serverInput =  Scratch.Cast.toString(
        args.SERVER !== undefined ? args.SERVER : this.sessionServerInput
      ).trim()

      if (serverInput && !this._configureSessionServer(serverInput)) {
        return
      }
    }

    createPeer (args) {
      const username = Scratch.Cast.toString(
        args.USERNAME !== undefined ? args.USERNAME : args.ID
      ).trim()

      if (!username) {
        this._recordPeerError('Username cannot be empty.')
        return
      }

      return this._createPeer(username)
    }

    readPeerErrorInfo () {
      if (!this.peer) return this.lastPeerErrorInfo
      return this.peer.errorInfo || this.lastPeerErrorInfo
    }

    connectToPeer ({ ID }) {
      const peerId = this.resolvePeerId(Scratch.Cast.toString(ID))

      if (!this.peer || this.peer.destroyed) return
      if (this.peer.disconnected && this.peerStatus !== 'connecting') return

      const existing = this.dataConnections.get(peerId)
      if (existing) {
        if (existing.open) return
        this._failOutgoingConnection(existing)
      }

      let conn
      try {
        conn = this.peer.connect(peerId, {
          label: 'default',
          metadata: {
            name: this.name,
            protocol: 'delta'
          },
          reliable: true,
          serialization: 'json'
        })
      } catch (err) {
        this._recordPeerError(err)
        return
      }

      conn._cldeltaConnectTimeout = setTimeout(() => {
        if (this.dataConnections.get(conn.peer) !== conn || conn.open) return

        this._failOutgoingConnection(
          conn,
          `Timed out connecting to peer "${peerId}".`
        )
      }, this.outgoingConnectTimeoutMs)

      this.dataConnections.set(conn.peer, conn)
      this._ensureConnProperties(conn)
      this._ensureDefaultChannel(conn)
      this._handleDataConnection(conn)
    }

    disconnectFromPeer ({ ID }) {
      const idStr = Scratch.Cast.toString(ID)
      let peerId = idStr

      if (!this.dataConnections.has(idStr)) {
        peerId = this.resolvePeerId(idStr)
      }

      if (!this.peer) return
      if (!this.dataConnections.has(peerId)) return

      this.dataConnections.get(peerId).close()
      this.dataConnections.delete(peerId)
    }

    isOtherPeerConnected ({ ID }) {
      const idStr = Scratch.Cast.toString(ID)
      if (this._isOtherPeerConnected(idStr)) return true
      const resolvedId = this.resolvePeerId(idStr)
      return this._isOtherPeerConnected(resolvedId)
    }

    closePeerChannel ({ ID, CHANNEL }) {
      const idStr = Scratch.Cast.toString(ID)
      let peerId = idStr

      if (!this.dataConnections.has(idStr)) {
        peerId = this.resolvePeerId(idStr)
      }

      const channel = Scratch.Cast.toString(CHANNEL)
      if (!this._isOtherPeerStored(peerId)) return

      const conn = this.dataConnections.get(peerId)
      if (!conn || !conn.channels || !conn.channels.has(channel)) return

      conn.channels.get(channel).chan.close()
    }

    async openNewPeerChannel ({ ID, CHANNEL, ORDERED }) {
      const idStr = Scratch.Cast.toString(ID)
      let peerId = idStr

      if (!this.dataConnections.has(idStr)) {
        peerId = this.resolvePeerId(idStr)
      }

      const channel = Scratch.Cast.toString(CHANNEL)
      const ordered = Scratch.Cast.toBoolean(ORDERED)

      if (!this.isPeerConnected()) return
      if (!this._isOtherPeerStored(peerId)) return

      const conn = this.dataConnections.get(peerId)
      if (!conn) return
      if (conn.channels.has(channel)) return

      const lockId = 'cldeltacore_' + peerId + '_' + channel
      await navigator.locks.request(lockId, async () => {
        const liveConn = this.dataConnections.get(peerId)
        if (!liveConn) return
        if (liveConn.channels.has(channel)) return

        this._ensureConnProperties(liveConn)

        const id = liveConn.idCounter++
        const chan = liveConn.peerConnection.createDataChannel(channel, {
          ordered: ordered,
          negotiated: true,
          id: id
        })

        this._chanMethodBinder(liveConn, chan)
        this._ensureChanProperties(liveConn, channel, chan)

        this._ensureDefaultChannel(liveConn)
        this._sendOnChannel(
          liveConn,
          'default',
          JSON.stringify({
            opcode: 'NEW_CHAN',
            ttl: 1,
            payload: {
              id: id,
              label: channel,
              ordered: ordered
            }
          })
        )
      })
    }

    sendMessageToPeer ({ MESSAGE, ID, CHANNEL }) {
      this._sendMessageToPeer(
        MESSAGE,
        Scratch.Cast.toString(ID),
        Scratch.Cast.toString(CHANNEL)
      )
    }

    _sendMessageToPeer (message, id, channel, opcode = 'P_MSG') {
      let target = id

      if (!this.dataConnections.has(id) && this.enableIdRemapper && this.idRemapper) {
        const resolved = this.idRemapper().get(id)
        if (resolved) target = resolved
      }

      if (this.maskedConnections.has(target)) return

      this._send({
        opcode,
        payload: message,
        target,
        channel
      })
    }

    sendMessageToAllPeers ({ MESSAGE, CHANNEL }) {
      this._sendMessageToAllPeers(MESSAGE, Scratch.Cast.toString(CHANNEL))
    }

    _sendMessageToAllPeers (message, channel, opcode = 'G_MSG') {
      this._send({
        opcode,
        payload: message,
        target: '*',
        channel
      })
    }

    getPeerStats ({ TYPE, ID }) {
      const idStr = Scratch.Cast.toString(ID)
      let peer = idStr

      if (!this.dataConnections.has(idStr)) {
        peer = this.resolvePeerId(idStr)
      }

      if (!this._isOtherPeerStored(peer)) return 0
      const conn = this.dataConnections.get(peer)

      switch (Scratch.Cast.toString(TYPE)) {
        case 'transmit speed (bytes/s)':
          return Math.round(conn.outgoingBitrate)
        case 'receive speed (bytes/s)':
          return Math.round(conn.incomingBitrate)
        case 'total sent (bytes)':
          return conn.totalSendBytes
        case 'total received (bytes)':
          return conn.totalRecvBytes
        case 'ping round-trip time (ms)':
          return conn.rtt
        case 'ping offset (ms)':
          return conn.clockOffset
        case 'connection duration (s)':
          if (!conn.openTime) return 0
          return Math.round((Date.now() - conn.openTime) / 1000)
        default:
          return 0
      }
    }

    disconnectPeer () {
      this._clearPeerConnectTimeout()
      if (!this.peer) return
      if (!this.peer.disconnected) this.peer.disconnect()
      this.peerStatus = 'disconnected'
    }

    reconnectPeer () {
      if (!this.peer) return
      if (this.peer.disconnected) {
        this.peerStatus = 'connecting'
        this.peer.reconnect()
      }
    }

    destroyPeer () {
      this._clearPeerConnectTimeout()
      if (!this.peer) return
      if (!this.peer.destroyed) this.peer.destroy()
      this.peer = null
      this.peerStatus = 'destroyed'
      this._resetConnectionState()
    }

    isPeerConnected () {
      if (!this.peer) return false
      if (this.peerStatus === 'open') return true
      return !!this.peer.open && !this.peer.disconnected && !this.peer.destroyed
    }

    whenPeerGetsGlobalPacket ({ CHANNEL }) {
      return this.lastGlobalPacket.channel === Scratch.Cast.toString(CHANNEL)
    }

    whenPeerGetsPacket ({ ID, CHANNEL }) {
      const idStr = Scratch.Cast.toString(ID)
      const resolvedId = this.resolvePeerId(idStr)
      const channel = Scratch.Cast.toString(CHANNEL)

      const peerMatches =
        this.lastPacket.peer === idStr || this.lastPacket.peer === resolvedId

      return peerMatches && this.lastPacket.channel === channel
    }

    whenSpecificPeerConnects ({ ID }) {
      const idStr = Scratch.Cast.toString(ID)
      const resolvedId = this.resolvePeerId(idStr)
      return (
        this.newestConnected === idStr || this.newestConnected === resolvedId
      )
    }

    whenSpecificPeerDisconnects ({ ID }) {
      const idStr = Scratch.Cast.toString(ID)
      const resolvedId = this.resolvePeerId(idStr)
      return (
        this.lastDisconnected === idStr || this.lastDisconnected === resolvedId
      )
    }

    doesPeerHaveChannel ({ ID, CHANNEL }) {
      const idStr = Scratch.Cast.toString(ID)
      let peerId = idStr

      if (!this.dataConnections.has(idStr)) {
        peerId = this.resolvePeerId(idStr)
      }

      const channel = Scratch.Cast.toString(CHANNEL)
      if (!this._isOtherPeerStored(peerId)) return false

      const conn = this.dataConnections.get(peerId)
      if (!conn) return false
      return conn.channels.has(channel)
    }

    readPacketFromPeer ({ ID, CHANNEL }) {
      const idStr = Scratch.Cast.toString(ID)
      let peerId = idStr

      if (!this.dataConnections.has(idStr)) {
        peerId = this.resolvePeerId(idStr)
      }

      const channel = Scratch.Cast.toString(CHANNEL)
      if (!this._isOtherPeerStored(peerId)) return ''

      const conn = this.dataConnections.get(peerId)
      if (!conn || !conn.channels.has(channel)) return ''

      const entry = this._getChan(conn, channel)
      return entry ? entry.data : ''
    }

    readGlobalPacketData ({ CHANNEL }) {
      const chan = Scratch.Cast.toString(CHANNEL)
      if (!this.gmsg_state.has(chan)) return ''
      return this.gmsg_state.get(chan).value
    }

    readGlobalPacketOrigin ({ CHANNEL }) {
      const chan = Scratch.Cast.toString(CHANNEL)
      if (!this.gmsg_state.has(chan)) return ''
      return this._prettyPeer(this.gmsg_state.get(chan).origin)
    }

    readNewestPeerConnected () {
      return this._prettyPeer(this.newestConnected)
    }

    readLastPeerDisconnected () {
      return this._prettyPeer(this.lastDisconnected)
    }

    storePeerChannels ({ ID, LIST }, util) {
      const peerIdInput = Scratch.Cast.toString(ID)
      const peerId = this.dataConnections.has(peerIdInput)
        ? peerIdInput
        : this.resolvePeerId(peerIdInput)
      const listName = Scratch.Cast.toString(LIST)

      const targetList = getTarget(util.target, listName, 'list')
      if (!targetList) return

      const peer = this.dataConnections.get(peerId)
      if (!peer) return

      targetList.value = Array.from(peer.channels.keys())
      targetList._monitorUpToDate = false
    }
  }

  // Register the extension
  const core = new CloudLinkDelta_Core()
  Scratch.extensions.register(core)
  Scratch.vm.runtime.ext_cldelta_core = core
  console.log('CLΔ Core extension loaded.')

  // Load all registered plugins
  if (Scratch.vm.runtime.ext_cldelta_pluginloader.length > 0) {
    for (const plugin of Scratch.vm.runtime.ext_cldelta_pluginloader) {
      plugin.register(core)
    }
    console.log(
      'CLΔ Core loaded ' +
        Scratch.vm.runtime.ext_cldelta_pluginloader.length +
        ' plugin(s) during startup.'
    )
    // Clean up
    Scratch.vm.runtime.ext_cldelta_pluginloader = new Array()
  }

  // Run diagnostics
  core._runDiagnostics()
})(Scratch)