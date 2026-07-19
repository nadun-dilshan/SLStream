import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

/**
 * Catches render errors anywhere in the route tree so a bad channel entry
 * or data bug shows a recovery card instead of a white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('SLStream render error:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
    // A full reload clears any corrupted transient state
    window.location.href = '/'
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="grid min-h-[70vh] place-items-center px-4 text-center">
        <div className="max-w-md">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-[#181818] text-[#e50914]">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-2xl font-black">Something went wrong</h1>
          <p className="mt-2 text-sm text-white/55">
            An unexpected error interrupted playback or rendering. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded bg-[#e50914] px-6 font-bold text-white transition hover:bg-[#f6121d] focus:outline-none focus:ring-4 focus:ring-[#e50914]/50"
          >
            <RotateCcw className="h-5 w-5" />
            Reload SLStream
          </button>
        </div>
      </div>
    )
  }
}
