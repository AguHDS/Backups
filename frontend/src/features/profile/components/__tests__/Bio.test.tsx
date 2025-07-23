import { render, screen, fireEvent } from '@testing-library/react'
import { Bio } from '../Bio'
import { vi, type Mock } from 'vitest'
import { useProfile } from '../../context/ProfileContext'

vi.mock('../../context/ProfileContext', () => ({useProfile: vi.fn()}))

const mockUseProfile = useProfile as Mock

describe('Bio component', () => {
  const bioText = 'This is my bio';
  const onBioChange = vi.fn();

  afterEach(() => { vi.clearAllMocks() })

  it('renders static bio when not editing', () => {
    mockUseProfile.mockReturnValue({ isEditing: false })

    render(<Bio bio={bioText} onBioChange={onBioChange} />)

    expect(screen.getByText('Biography')).toBeInTheDocument()
    expect(screen.getByText(bioText)).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('renders textarea when editing', () => {
    mockUseProfile.mockReturnValue({ isEditing: true })

    render(<Bio bio={bioText} onBioChange={onBioChange} />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByDisplayValue(bioText)).toBeInTheDocument()
  })

  it('calls onBioChange when textarea is changed', () => {
    mockUseProfile.mockReturnValue({ isEditing: true })

    render(<Bio bio={bioText} onBioChange={onBioChange} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Updated bio' } })

    expect(onBioChange).toHaveBeenCalledWith('Updated bio')
  })
})
