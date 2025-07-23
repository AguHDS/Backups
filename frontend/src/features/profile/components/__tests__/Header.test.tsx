import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'
import { useProfile } from '../../context/ProfileContext'

vi.mock('../../context/ProfileContext', () => ({ useProfile: vi.fn() }))

const mockUseProfile = useProfile as unknown as ReturnType<typeof vi.fn>

describe('Header', () => {
  const username = 'testuser';
  const onSave = vi.fn();
  const onCancel = vi.fn();
  const setIsEditing = vi.fn();

  afterEach(() => { vi.clearAllMocks() })

  it('renders username title', () => {
    mockUseProfile.mockReturnValue({
      isEditing: false,
      setIsEditing,
      isOwnProfile: true,
    })

    render(<Header username={username} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByText(`${username}'s profile`)).toBeInTheDocument()
  })

  it('does not render any button if not own profile', () => {
    mockUseProfile.mockReturnValue({
      isEditing: false,
      setIsEditing,
      isOwnProfile: false,
    })

    render(<Header username={username} onSave={onSave} onCancel={onCancel} />)
    expect(screen.queryByText('Edit profile')).not.toBeInTheDocument()
  })

  it('shows edit profile and triggers setIsEditing', () => {
    mockUseProfile.mockReturnValue({
      isEditing: false,
      setIsEditing,
      isOwnProfile: true,
    })

    render(<Header username={username} onSave={onSave} onCancel={onCancel} />)

    const editBtn = screen.getByText('Edit profile')
    fireEvent.click(editBtn)
    expect(setIsEditing).toHaveBeenCalledWith(true)
  })

  it('shows Save and Cancel buttons when editing', () => {
    mockUseProfile.mockReturnValue({
      isEditing: true,
      setIsEditing,
      isOwnProfile: true,
    })

    render(<Header username={username} onSave={onSave} onCancel={onCancel} />)

    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Save'))
    expect(onSave).toHaveBeenCalled()

    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
  })
})
