import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { FieldArray } from 'react-final-form-arrays'
import { MACHINE_BUILDER_XP } from 'src/mocks/user_pp.mock'
import { CustomCheckbox } from './Fields/CustomCheckbox.field'
import { IUserPP } from 'src/models/user_pp.models'

interface IProps {
  user: IUserPP
}

export class ExpertiseSection extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      isOpen: props.user && !props.user.profileType,
    }
  }

  render() {
    const { isOpen } = this.state
    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small>Expertise</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Text regular my={4}>
            What are you specialised in ? *
          </Text>
          <Flex wrap="nowrap">
            <FieldArray name="machineBuilderXp">
              {({ fields }) => (
                <>
                  {MACHINE_BUILDER_XP.map((xp, index: number) => (
                    <CustomCheckbox
                      key={index}
                      value={xp.label}
                      index={index}
                      isSelected={
                        fields.value ? fields.value.includes(xp.label) : false
                      }
                      onChange={() => {
                        if (fields.value && fields.value.length !== 0) {
                          if (fields.value.includes(xp.label)) {
                            fields.value.map((value, selectedValIndex) => {
                              if (value === xp.label) {
                                fields.remove(selectedValIndex)
                              }
                            })
                          } else {
                            fields.push(xp.label)
                          }
                        } else {
                          fields.push(xp.label)
                        }
                      }}
                      btnLabel={xp.label}
                    />
                  ))}
                </>
              )}
            </FieldArray>
          </Flex>
        </Box>
      </FlexSectionContainer>
    )
  }
}
