import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { MeteorProfile, Volunteers } from '../both/init'

/*  managers, leads and the user itself is authorized to see the picture. */
Meteor.publish('meteor-user-profiles.ProfilePictures', function publishProfilePictures(userId = this.userId) {
  if (!this.userId) return null
  check(userId, String)

  if (this.userId === userId // the user asking for its picture
    || Volunteers.auth.isALead()) { // a lead, metalead or admin asking
    return MeteorProfile.ProfilePictures.find({ userId }).cursor
  }
  return null
})

Meteor.publish('user.extra', function publishUserExtra(userId = this.userId) {
  if (!this.userId) return null
  check(userId, String)

  // User can see their own data including emails
  if (this.userId === userId) {
    return Meteor.users.find({ _id: userId }, {
      fields: {
        emails: true,
        profile: true,
        ticketId: true,
        status: true,
        isBanned: true,
      },
    })
  }

  // Leads can see basic user data but NOT emails (privacy protection)
  if (Volunteers.auth.isALead()) {
    return Meteor.users.find({ _id: userId }, {
      fields: {
        profile: true,
        ticketId: true,
        status: true,
        isBanned: true,
      },
    })
  }
  return null
})

// Separate publication for managers who need email access
Meteor.publish('user.email', function publishUserEmail(userId) {
  if (!this.userId) return null
  check(userId, String)

  // Only managers can see user emails through publication
  if (Volunteers.auth.isManager()) {
    return Meteor.users.find({ _id: userId }, {
      fields: {
        emails: true,
      },
    })
  }
  return null
})
