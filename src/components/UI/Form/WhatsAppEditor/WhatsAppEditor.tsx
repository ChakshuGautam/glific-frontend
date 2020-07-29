import React, { useState } from 'react';
// import 'draft-js/dist/Draft.css';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import defaultTheme from 'draft-js-emoji-plugin';
// import editorStyles from './editorStyles.css';
import Editor from 'draft-js-plugins-editor';
import { EditorState, ContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';
// import styles from './ChatInput.module.css';
import sendMessageIcon from '../../../../assets/images/icons/SendMessage.svg';
import 'draft-js-emoji-plugin/lib/plugin.css';
import { convertToWhatsApp } from '../../../../common/RichEditor';
// import { StyledEmojiSelectWrapper, GlobalStyleForEmojiSelect } from './draftJsPluginBaseStyles';
import ReactResizeDetector from 'react-resize-detector';
import styles from './WhatsAppEditor.module.css';

const emojiTheme = {
  emojiSelectPopover: styles.EmojiSelector,
};

const emojiPlugin = createEmojiPlugin({ useNativeArt: true }); // , theme: emojiTheme
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [emojiPlugin];

export interface WhatsAppEditorProps {
  setMessage(message: string): void;
  handleHeightChange(newHeight: number): void;
  sendMessage(): void;
}

export const WhatsAppEditor: React.SFC<WhatsAppEditorProps> = (props) => {
  const emojiPlugin = createEmojiPlugin();
  const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
  const plugins = [emojiPlugin];
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleChange = (editorState: any) => {
    setEditorState(editorState);
    // props.setMessage(convertToWhatsApp(editorState));
    // inputEl.current.focus();
  };

  const handleKeyCommand = (command: string, editorState: any) => {
    // On enter, submit. Otherwise, deal with commands like normal.
    if (command === 'enter') {
      // Convert Draft.js to WhatsApp
      props.sendMessage();
      const newState = EditorState.createEmpty();
      // setEditorState(newState);
      // setEditorState(EditorState.moveFocusToEnd(newState));
      setEditorState(
        EditorState.moveFocusToEnd(
          EditorState.push(editorState, ContentState.createFromText(''), 'remove-range')
        )
      );
      return 'handled';
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const keyBindingFn = (e: any) => {
    // Shift-enter is by default supported. Only 'enter' needs to be changed.
    if (e.keyCode === 13 && !e.nativeEvent.shiftKey) {
      return 'enter';
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <>
      <ReactResizeDetector
        handleHeight
        onResize={(width: any, height: any) => props.handleHeightChange(height - 40)} // 40 is the initial height
      >
        <div className={styles.Editor}>
          <Editor
            editorState={editorState}
            onChange={handleChange}
            plugins={plugins}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
          />
        </div>
      </ReactResizeDetector>
      {/* <div className={styles.EmojiContainer}>
          <IconButton
            data-testid="emoji-picker"
            color="primary"
            aria-label="pick emoji"
            component="span"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <span role="img" aria-label="pick emoji">
              😀
            </span>
          </IconButton>
        </div> */}
      <div className={styles.EmojiButton}>
        <EmojiSelect />
      </div>
    </>
  );
};

export default WhatsAppEditor;
